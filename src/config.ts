import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://timozander.de/",
  author: "Timo Zander",
  desc: "Hey, my name is Timo Zander. I am a software developer and write about all things tech.",
  title: "Timo Zander",
  metaTitle: "Timo Zander — Cologne-based Software Developer",
  ogImage: "og-image.jpg",
  lightAndDarkMode: false,
  postPerPage: 30,
  recentPostCount: 3,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Mail",
    iconName: "i-ph-envelope",
    href: "mailto:timo@timozander.de",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Github",
    iconName: "i-ph-github-logo",
    href: "https://github.com/timozander",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    iconName: "i-ph-linkedin-logo",
    href: "https://www.linkedin.com/in/timo-zander-b42784222/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Twitter",
    iconName: "i-ph-twitter-logo",
    href: "https://twitter.com/tzdev",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Mastodon",
    iconName: "i-ph-mastodon-logo",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
