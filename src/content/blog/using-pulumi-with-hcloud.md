---
title: Creating a server on Hetzner Cloud using Pulumi
description: How to use Pulumi to create and provision new servers on Hetzner Cloud, to later deploy a Docker application.
draft: false
date: 2023-05-25
---

[Hetzner](https://www.hetzner.com/) has always been my go-to VPS provider. For one side project, I wanted to try out [Hetzner Cloud](https://www.hetzner.com/cloud) (hcloud) since I needed to very spontaneously spin up and down servers. [Pulumi](https://www.pulumi.com/) has also been on my radar for a while now, so I decided to combine both. My previous experience with _Infrastructure as Code_ was basically zero, so I had to learn a lot. This post is a summary of what I learned and how I set up the infrastructure for my particular project.

- [My goal](#my-goal)
- [Preparing the server environment](#preparing-the-server-environment)
- [Choosing an image for the server](#choosing-an-image-for-the-server)
- [Creating the server](#creating-the-server)
- [Preparing the Docker registry](#preparing-the-docker-registry)
- [Uploading configuration files](#uploading-configuration-files)
- [Ready for takeoff](#ready-for-takeoff)

If you are in a hurry, [you can find the full source code of this article on my GitHub repository](https://github.com/timozander/pulumi-hcloud-docker-example)


___

## My goal

I wanted to simply deploy my application. During the build pipeline, I packaged it as a Docker image and put it on my GitHub Container Registry. So, what the deployment process needs to do is:

1. Spin up a new hcloud server
2. Give it the right IP, so that it can be reached
3. Install SSH keys for convenient access
4. Prepare all the necessary software (like installing docker)
5. Pulling the image from the registry and running it

Note that I did not want to deal with wildcard subdomains or automatic DNS configuration. Instead, I manually pre-configured my desired domain names to point to previously created IP addresses. However, whenever I just needed a temporary environment, I dropped that and used a random IPv6 address instead -- since hcloud charges for IPv4. With Pulumi, I wanted to specifically prepare everything so that deploying an updated build comes down to just running `docker-compose up -d` via SSH.

To get started, I installed Pulumi and created a new empty project using the `typescript` template. Since there were no pre-existing templates for hcloud, I just went with the simplest setup. A freshly created Pulumi project then looks like this:

```
node_modules/
.gitignore
index.ts
package.json
package-lock.json
Pulumi.yaml
tsconfig.json
```

The `Pulumi.yaml` file serves as a configuration for basics like project name and description, as well as which runtime to use. In my case, I used Node.js with TypeScript. The `index.ts` file is the entry point and declares which resources Pulumi needs to spin up. This article will guide you through this file specifically.

## Preparing the server environment

First, I read the name of the current stack. A [_stack_](https://www.pulumi.com/docs/intro/concepts/stack/) in Pulumi is like a separate branch of your infrastructure with its own configuration values. Typically, you have something like a `production` stack, a `dev` stack and so on. 

```ts
const stack = pulumi.getStack()
```

I prefixed my pre-created IP addresses with the stack name, so that I can easily identify them. Note that you can also easily create those IPs within Pulumi using `new hcloud.PrimaryIp()`. Pulumi is able to interact with hcloud using the [`@pulumi/hcloud` package](https://www.pulumi.com/registry/packages/hcloud/). 

The configuration flag `create_ip` helped me to determine whether my stack has a pre-configured IP that should be reused, or whether a new one needs to be created.

```ts
// Get created IP adresses
let primaryIpv4 = null;
let primaryIpv6 = null;

if (config.getBoolean("create_ip")) {
  const ipConfig = {
    assigneeType: "server",
    datacenter: "nbg1-dc3",
    autoDelete: true,
  };

  primaryIpv4 = new hcloud.PrimaryIp(`${stack}-primary_ip-v4`, {
    ...ipConfig,
    type: "ipv4",
  });
  primaryIpv6 = new hcloud.PrimaryIp(`${stack}-primary_ip-v6`, {
    ...ipConfig,
    type: "ipv6",
  });
} else {
  primaryIpv4 = hcloud.getPrimaryIpOutput({
    name: `${stack}-primary_ip-v4`,
  });
  primaryIpv6 = hcloud.getPrimaryIpOutput({
    name: `${stack}-primary_ip-v6`,
  });
}

```

Furthermore, I generated a fresh SSH key that I will use for the Pulumi provisioning, but also linked already existing keys to the server. This way, I can conveniently access it after its provisioning. In the Hetzner Cloud Console, you can add Labels to your keys, so that they can be specifically queried here.

```ts
// Get all SSH keys that should be assigned to server
const standardSshKeys = await hcloud
  .getSshKeys({ withSelector: "myproject" })
  .then((allKeys) => allKeys.sshKeys);

// Create new SSH key to be used for deployment
const sshKey = new tls.PrivateKey("sshKey", {
  algorithm: "RSA",
  rsaBits: 4096,
});
const defaultSshKey = new hcloud.SshKey("default-sshKey", {
  publicKey: sshKey.publicKeyOpenssh,
});
```

## Choosing an image for the server

Hetzner Cloud offers several images, ranging from a basic OS for your server to a stack consisting of an underlying OS and apps like Jitsi or Docker. This saves me from having to provision the server by installing Docker. Since April 2023, hcloud also [offers ARM-based servers](https://www.hetzner.com/de/press-release/arm64-cloud/), so that each image is available for the `x86` and `arm` architecture. To uniquely identify the needed image, I need to query its ID.

```ts
// Get x86 docker image
const dockerImage = await hcloud.getImage({
  name: "docker-ce",
  withArchitecture: "x86",
});
```

## Creating the server

With all the legwork done, the actual server can be created. The `@pulumi/hcloud` package uses the hcloud API in the background, so that it allows for the same options and configuration as the hcloud UI. I chose the Nuremberg data center and selected the cheapest type they got (`cx11`). As a testing environment, I really did not need much power, since for low loads the cheapest option is more than enough. The `name` is just used to identify the server within the UI later.

```ts
// Create server
const server = new hcloud.Server("server", {
  location: "nbg1",
  image: `${dockerImage.id}`, // hcloud API expects a string
  name: `${stack}.timozander.de`,
  serverType: "cx11",
  publicNets: [
    {
      ipv4Enabled: true,
      ipv4: primaryIpv4.id,
      ipv6Enabled: true,
      ipv6: primaryIpv6.id,
    },
  ],
  sshKeys: [defaultSshKey.name, ...standardSshKeys.map((key) => key.name)],
});
```

Each Pulumi resource needs a unique identifier. For the server, I just used `server`. Those names are only used to identify resources _within_ stacks, not across. So as long as there is only one server resource within your infrastructure, it is perfectly fine to give it a simple name. Keep it mind that those names will also be shown in user-facing outputs. A good name can therefore help to understand which specific resource is causing an error. Also, Pulumi usually uses the given identifier to [name the physical resources](https://www.pulumi.com/docs/intro/concepts/resources/names/#autonaming) at your cloud provider.


## Preparing the Docker registry

At this point, the server is basically ready to use and can be accessed via SSH. However, I wanted to provide some configuration files, as well as my `docker-compose.yml` for the testing environment. The `@pulumi/command` package allows you to run arbitrary commands on the server. I used that to transfer the files from my local machine to the server. Since it connects via SSH, the previously created key can be used here. The package is in a Preview stage, so be cautious using it. For my simple purposes, it worked well, though.

```ts
const connection: types.input.remote.ConnectionArgs = {
  host: server.ipv6Address,
  user: "root",
  privateKey: sshKey.privateKeyPem,
};

// Copy docker-compose file
const copyDockerCompose = new remote.CopyFile("Copy docker-compose.yml", {
  connection,
  localPath: `docker-compose.${stack}.yml`,
  remotePath: "docker-compose.yml",
});
```

I also logged in into my GitHub Package registry to give access to the private Docker images I wanted to use. If you use a public registry, you can skip this step.

```ts
// Login to Docker Registry
const dockerLoginCmd = config.requireSecret("github_pat").apply(
  (secret) =>
    `echo "${secret}" | 
      docker login ghcr.io -u timozander --password-stdin`
);

const dockerLogin = new remote.Command("Docker Login", {
  connection,
  create: dockerLoginCmd,
});
```

Here you can nicely observe [Pulumi's Output concept](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/). The `requireSecret()` method returns `Output<string>` that can either be directly accessed, or transformed for further usage. The whole idea is to allow Pulumi to automatically track the dependencies between the different steps: If the resource changes, the command will be re-run. And if a resource is not used anywhere, Pulumi will not even try to retrieve it. I transformed the secret into the shell command to log in to the registry. The `apply()` method is used to transform the output. It is similar to the standard `map()` method on arrays.

## Uploading configuration files

I wanted to upload my `user_conf.d` directory for my Nginx server, too. Since this does not change all that often, deploying it with every new version seemed unnecessary. Unfortunately, the `remote.CopyFile` resource that I used to upload the `docker-compose.yml` does not allow for uploading directories (there is [an open issue](https://github.com/pulumi/pulumi-command/issues/23) though). 

```ts
// Install necessary software and pull container
new remote.Command(
  "Install Docker",
  {
    connection,
    create: [
      "mkdir -p user_conf.d",
      `echo '${fs
        .readFileSync("user_conf.d/app.conf")
        .toString()}' > user_conf.d/app.conf`,
      "apt-get update",
      "apt-get -y install docker-compose",
      "docker-compose pull",
    ].join(" && "),
  },
  {
    dependsOn: [dockerLogin, copyDockerCompose],
  }
);

```

My hacky solution is to load the file contents using `fs` and just write them manually into files via sh. This is not the most elegant solution, but it works and can be easily extended for larger directories and subdirectories. I also installed docker-compose and pulled the initial versions of my container. This also makes sure that the login worked successfully. 

## Ready for takeoff

Now that the `index.ts` file correctly specifies the needed resources, Pulumi can be run. After entering `pulumi up`, the CLI gives a preview of which changes will be made and asks for confirmation. If you have an already running instance of your stack, then Pulumi detects changes and only manipulates the resources that need to be changed.

Make sure that your [hcloud API token is properly set](https://www.pulumi.com/registry/packages/hcloud/installation-configuration/). Otherwise, Pulumi will complain:
```
Diagnostics:
  pulumi:providers:hcloud (default_1_11_1):
    error: rpc error: code = InvalidArgument desc = required configuration keys were missing
```

After the successful creation of your server, all that is left to do is to ssh into it and run `docker-compose up -d`. In my build pipeline, I used the [`appleboy/ssh-action`](https://github.com/appleboy/ssh-action) GitHub action to connect to my server and pull the latest image. This way, I could also put some secrets into my machine's environment to be used by my application.
  
```yaml	
- name: "Deployment: Update Docker images"
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USERNAME }}
    key: ${{ secrets.HETZNER_SSH_KEY }}
    script: |
      export SERVER_A_API_KEY="${{ secrets.SERVER_A_API_KEY }}"
      export JWT_SECRET="${{ secrets.JWT_SECRET }}"
      export APP_URL="..."
      docker-compose pull
      docker-compose up -d --remove-orphans
      docker image prune -f
```



[You find the full source code on my GitHub repository](https://github.com/timozander/pulumi-hcloud-docker-example)