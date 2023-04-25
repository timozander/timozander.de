---
title: Using Pulumi with Hetzner Cloud
description: TODO
draft: false
date: 2023-05-25
---

To me, [Hetzner](https://www.hetzner.com/) has always been my go-to VPS provider. For one side project I wanted to try out [Hetzner Cloud](https://www.hetzner.com/cloud) (hcloud) since I needed to very spontaneously spin up and down servers. I also wanted to try out [Pulumi](https://www.pulumi.com/) for a while now, so I decided to combine both. My previous experience with _Infrastructure as Code_ was basically zero, so I had to learn a lot. This post is a summary of what I learned and how I set up the infrastructure of my particular project.

___

## What I wanted to achieve

I wanted to deploy my application. During the build pipeline, I packaged it as a Docker image and put it on my GitHub Container Registry. So, what the deployment process needs to do is:

1. Spin up a new hcloud server
2. Give it the right IP, so that it can be reached
3. Install SSH keys for convenient access
4. Prepare all the necessary software (like installing docker)
5. Pulling the image from the registry and running it

Note that I did not want to handle with wildcard subdomains or automatic DNS configuration. Instead, I manually pre-configured my desired domain names to point to previously created IP addresses. However, whenever I just needed a temporary environment, I dropped that and used a random IPv6 address instead - since hcloud charges for IPv4.

I installed Pulumi, and created a new empty project using the `typescript` template. Since there were not any pre-existing templates for hcloud, I just went with the simplest setup.

```
node_modules/
.gitignore
index.ts
package.json
package-lock.json
Pulumi.yaml
tsconfig.json
```

The `Pulumi.yaml` file serves as a configuration for basics like project name, a description and which runtime to use. In my case, this was Node.js. The `index.ts` file serves as an entrypoint and declares which resources Pulumi needs to spin up.
