import { SITE } from "@config"

export const generatePageTitle = (title: string) => {
  return `${title} | ${SITE.title}`
}
