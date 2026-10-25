<!-- portfolio:section {"id":"intro","type":"hero","subtitle":"AI + full-stack developer · AI systems · backend & systems"} -->
# Nishchay Kumar

I’m Nishchay Kumar, a software developer interested in building useful products and understanding the systems behind them. I work across full-stack development, backend engineering, and generative AI, with a particular interest in AI agents, developer tools, and reliable multi-step workflows.

I enjoy taking ideas from architecture to implementation—building APIs and interfaces, connecting models to tools, and thinking through testing, evaluation, failure handling, and deployment. I’m especially interested in projects where AI engineering meets practical software and systems design.

[GitHub](https://github.com/kaiju-no-9) · [LinkedIn](https://www.linkedin.com/in/nishchay-kumar-63bb92325/) · [X](https://x.com/kumar_nish98725) · [Email](mailto:nishchaykumar89@gmail.com)
<!-- portfolio:endsection -->

<!-- portfolio:section {"id":"featured-projects","type":"project-grid","title":"Projects","eyebrow":"SELECTED ENGINEERING WORK"} -->
## Projects

<!-- portfolio:item {"id":"oden","type":"project","featured":true,"tagline":"workspace-scoped coding agent","category":"AI · tools","repo":"https://github.com/kaiju-no-9/oden","package":"https://www.npmjs.com/package/oden-agent","stack":["TypeScript","Bun","Gemini","OpenRouter"]} -->
### Oden

A terminal coding-agent harness for coding and research inside a selected project workspace. Oden can inspect and edit files, search for information, and run approved commands in a Docker Compose sandbox. It supports Gemini and OpenRouter, project-scoped sessions, streamed terminal activity, and approval gates for sensitive operations.

- **Engineering focus:** workspace-bounded tools, guarded shell and Git operations, credential handling, log redaction, and configurable request, token, tool, and time budgets.
- **Links:** [GitHub repository](https://github.com/kaiju-no-9/oden) · [npm package](https://www.npmjs.com/package/oden-agent)
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"loop-engg","type":"project","featured":true,"tagline":"reusable agent loops + CLI","category":"AI · tools","repo":"https://github.com/kaiju-no-9/loop_Engg","demo":"https://loop-wizard.framer.website/","stack":["Python","Node.js","YAML"]} -->
### Loop Engg

An open-source library of reusable AI-agent loops, plus the `loop-wizard` CLI for recurring engineering work. The CLI can scaffold loops, audit safety and readiness, estimate token and cost budgets, check execution status, and summarize loop health.

- **Engineering focus:** planner/worker/verifier patterns, dry runs, scoped file rules, budget caps, iteration limits, approval gates, and recovery guidance.
- **Links:** [GitHub repository](https://github.com/kaiju-no-9/loop_Engg) · [Project demo](https://loop-wizard.framer.website/)
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"dictator","type":"project","featured":true,"tagline":"AI-assisted video editor","category":"AI · media","repo":"https://github.com/kaiju-no-9/Dictator","stack":["React","TypeScript","Python","PostgreSQL","Redis"]} -->
### Dictator

An AI-assisted video editor with a web app, a TypeScript API, and a Python service for media analysis, planning, critique, and chat. Its API includes project and upload workflows, jobs, plan revisions, and render-related routes.

- **Engineering focus:** coordinating media workflows across the web, API, and AI service, with PostgreSQL, Redis-backed jobs, object storage, and FFmpeg integration.
- **Model note:** the repository includes the OpenAI SDK; no specific active production model is claimed here.
- **Source:** [GitHub repository](https://github.com/kaiju-no-9/Dictator). No live demo link is confirmed.
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"grabpic","type":"project","featured":true,"tagline":"event photo search with face embeddings","category":"AI · product","repo":"https://github.com/kaiju-no-9/GrabPic","demo":"https://grabpic.framer.ai/","stack":["React","TypeScript","Bun","FastAPI","PostgreSQL"]} -->
### GrabPic

An event photo retrieval platform. Organizers upload event photos; attendees submit a selfie to find event pictures containing them. The AI service detects faces, stores embeddings, and compares a query selfie with embeddings for that event.

- **Engineering focus:** separate web, backend, and AI services; image ingestion from Cloudinary; face embeddings and similarity search; authentication and media workflows.
- **Team:** Built by a two-person team. Individual contributions and impact metrics are not stated here.
- **Links:** [GitHub repository](https://github.com/kaiju-no-9/GrabPic) · [Project demo](https://grabpic.framer.ai/)
<!-- portfolio:enditem -->
<!-- portfolio:endsection -->

<!-- portfolio:section {"id":"more-projects","type":"project-grid","title":"Projects","eyebrow":"SYSTEMS, PRODUCTS & EXPERIMENTS"} -->
## Projects

<!-- portfolio:item {"id":"t8t","type":"project","tagline":"node-based crypto workflows","category":"product · automation","repo":"https://github.com/kaiju-no-9/t-8-t","stack":["React","TypeScript","Bun","MongoDB"]} -->
### t8t

An n8n-style workflow builder focused on crypto. It combines custom nodes with a chatbot-oriented interface and documents integrations for Hyperliquid, Backpack, and Lighter.

- **Engineering focus:** node-based workflow editing with React Flow, a React frontend, and a TypeScript/Bun backend.
- **Source:** [GitHub repository](https://github.com/kaiju-no-9/t-8-t). No live demo or completion status is confirmed; real-money trading safety is not claimed.
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"amber-brain","type":"project","tagline":"YAML-driven process manager","category":"backend · systems","repo":"https://github.com/kaiju-no-9/Amber","stack":["Go","YAML","Process management"]} -->
### Amber / Brain

An early Go workload manager with YAML-defined workloads, CLI and daemon entry points, process lifecycle tracking, stdout/stderr logs, and JSON state persistence.

- **Scope:** the checked-in engine supports ordinary host processes only. It does not provide container isolation or a security sandbox.
- **Source:** [GitHub repository](https://github.com/kaiju-no-9/Amber)
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"gocache","type":"project","tagline":"concurrent cache + replication","category":"systems · learning","repo":"https://github.com/kaiju-no-9/GoCache","stack":["Go","WAL","Raft-inspired"]} -->
### GoCache

A learning project for a concurrent key-value cache with TTL expiration, LRU eviction, a newline-delimited JSON write-ahead log, an HTTP API, deterministic sharding, and simplified Raft-style replication.

- **Scope:** an exploration of distributed-systems concepts, not a production-proven database or a claim of full Raft correctness.
- **Source:** [GitHub repository](https://github.com/kaiju-no-9/GoCache)
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"atlas","type":"project","tagline":"browser-based autonomous task agent","category":"AI · browser","repo":"https://github.com/kaiju-no-9/Atlas","stack":["Chrome extension","AI agents","Browser automation"]} -->
### Atlas

A browser-based agent for carrying out user-directed tasks autonomously through a Chrome extension.

- **Source:** [GitHub repository](https://github.com/kaiju-no-9/Atlas)
<!-- portfolio:enditem -->

<!-- portfolio:item {"id":"palimpsest","type":"project","tagline":"PyTorch-like C++ library","category":"systems · C++","repo":"https://github.com/kaiju-no-9/Palimpsest","stack":["C++","Machine learning"]} -->
### Palimpsest

A C++ machine-learning library inspired by PyTorch.

- **Source:** [GitHub repository](https://github.com/kaiju-no-9/Palimpsest)
<!-- portfolio:enditem -->
<!-- portfolio:endsection -->

<!-- portfolio:section {"id":"skills","type":"skills","title":"Engineering interests","eyebrow":"AREAS I LIKE WORKING IN"} -->
## Engineering interests

- **AI & agents:** agent harnesses, reliable multi-step workflows, RAG, and evaluation systems
- **Products:** full-stack applications, AI pipelines, and developer tools
- **Backend & systems:** APIs, databases, distributed systems, and open source
<!-- portfolio:endsection -->

