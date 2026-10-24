# Updating the portfolio

Portfolio profile and project information lives in [`content/portfolio.md`](content/portfolio.md). Root `README.md` is reserved for project setup and contributor documentation.

Visible copy is ordinary Markdown. Hidden HTML comments identify sections and project metadata:

```html
<!-- portfolio:section {"id":"about","type":"markdown","title":"About"} -->
## About

Write the section in Markdown.
<!-- portfolio:endsection -->
```

Supported section types are `hero`, `project-grid`, `skills`, `experience`, `github-activity`, `contact`, and `markdown`. Section order in the content file determines page order. IDs must be unique. Project items belong inside a `project-grid` and need a unique ID, a `stack` array, and an HTTPS `repo` URL:

```html
<!-- portfolio:item {"id":"sample","type":"project","repo":"https://github.com/owner/repo","stack":["TypeScript"]} -->
### Sample project

Describe what it does and what you worked on.
<!-- portfolio:enditem -->
```

Run `npm run portfolio:validate` before committing. Start the local site with `npm run dev`; `npm run build` validates the portfolio content and creates the production site in `dist/`.
