# timozander.de

Personal website and blog of Timo Zander, migrated to the [Lipi](https://github.com/thelocalhoststudio/lipi) Astro template.

## Content structure

- `src/content/posts/` — blog posts and talk resources
- `src/content/pages/` — standalone pages such as About, Projects, Legal, and Published Elsewhere
- `configs/user.config.ts` — site identity, navigation, and Lipi settings

Old URLs are redirected where possible:

- `/blog` → `/posts`
- `/blog/[slug]` → `/posts/[slug]`
- `/talk/enterjs-astro-2023` → `/posts/talks/enterjs-astro-2023`

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the site and generate the Pagefind search index |
| `npm run preview` | Preview the production build |

## Credits

The design and base implementation come from Lipi. The content belongs to Timo Zander and is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
