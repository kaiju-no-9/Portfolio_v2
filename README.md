# Nishchay Kumar — Portfolio

A minimal, responsive portfolio built with React, TypeScript, and Vite. Portfolio profile and project content is kept separately in [`content/portfolio.md`](content/portfolio.md), leaving this README as project documentation.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run portfolio:validate
npm run build
```

The production site is written to `dist/`.

## Update portfolio content

Edit `content/portfolio.md`. It uses Markdown with small HTML-comment markers to define page sections and project metadata. Validate your edits with `npm run portfolio:validate` before building.
