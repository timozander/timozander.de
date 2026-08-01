import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Timo Zander",
  description:
    "Software engineer, TypeScript enthusiast, and tech writer from Cologne, Germany.",

  url: "https://timozander.de",
  author: "Timo Zander",

  avatar: "/zander.jpg",

  navigation: [
    { title: "Blog", url: "/posts" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ],

  footerLinks: [{ title: "Imprint", url: "/imprint" }],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/timozander",
      icon: "github",
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/timo-zander-b42784222/",
      icon: "linkedin",
    },
    {
      title: "Email",
      url: "mailto:timo@timozander.de",
    },
  ],

  footerCredits: "Built with Astro & Lipi. Content by Timo Zander.",

  postsPerPage: 30,
  recentPosts: 4,
  relatedPosts: 4,

  showLogo: false,
  showThemeToggle: false,
  showReadingTime: true,

  heroVariant: "default",

  annotation: undefined,
};

export default userConfig;
