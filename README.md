# edu.loves.ml

Personal site and blog, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321 (drafts are visible here)
npm run build     # type-check + static build into dist/
npm run preview   # serve dist/
```

## Content

| What            | Where                           |
| --------------- | ------------------------------- |
| Name, tagline, social links, nav | `src/consts.ts`  |
| About page      | `src/pages/about.md`            |
| Blog posts      | `src/content/blog/*.md(x)`      |
| Projects        | `src/content/projects/*.md(x)`  |
| Colours, fonts  | `src/styles/global.css`         |

Frontmatter schemas live in `src/content.config.ts`. Posts with `draft: true` are left out of production builds and the RSS feed.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
The custom domain is set by `public/CNAME`.
