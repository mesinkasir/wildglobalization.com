# Wild Globalization

Static Eleventy site for Wild Globalization.

## Requirements

- Node.js 20+
- npm

## Commands

```bash
npm ci
npm run dev
npm run build
```

`npm run build` writes the production site to `_site/`.

## Layout

```text
.github/workflows/   GitHub Actions deploy workflow
src/_data/           site settings and navigation data
src/_includes/       Nunjucks layouts
src/assets/          CSS, JavaScript, images
src/content/         pages, blog posts, feeds, robots, sitemap
```

Generated and local-only files stay out of git: `_site/`, `node_modules/`, `.cache/`, `.env`, `.DS_Store`, logs, and private document drafts.

## Deploy

Pushes to `main` deploy `_site/` through XMIT. Manual deploys are available from the `Build and Deploy Eleventy` workflow in GitHub Actions.

Required repository secrets:

- `XMIT_KEY`

Optional repository variable:

- `XMIT_SITE` defaults to `wildglobalization.com`

## License

MIT. See [LICENSE](LICENSE).
