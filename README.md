# HOANGGIA AI — Design Studio V1.4

**Development build** · GitHub Pages (free static hosting) · Multi-Model References · 48 Expert Roles.

## Features

- AI Image Creator and AI Image Editor workspaces, master-image preview, text and image references.
- Model Library: add unlimited Models, rename freely, multiple image references per Model, material/category/dimensions/structure/target, separate prompts per selected Model.
- Six expert brains, 48 role definitions, expert auto/manual routing and seven design locks.
- Structured prompt generation, export/import JSON config, copy/download prompt, preview Before/After.
- Browser frontend only: no server keys or images are published to GitHub.
- Optional external image Gateway: Cloudflare Worker (sample code in `worker/`) to GPT Image generation and image editing with up to 16 input images per API call.

## GitHub Free setup

The repository hosts a **static site** (no npm build required).
After code review and merge to `main`: go to **Settings > Pages > Deploy from a branch**; choose **main**, **/(root)**, **Save**. The expected site URL is:

https://hoanggiaktsda-beep.github.io/da-studio/

For an early branch preview, choose `develop/v1.4-studio` instead of main in Pages. This is one publishing source, not an isolated preview.

## Tests

```bash
node --check app.mjs
node --check core.mjs
node --check worker/index.mjs
node --test tests/*.test.mjs
```

GitHub Actions workflow runs syntax and unit tests on feature branches and PRs.

## Live AI rendering

**GitHub Free does not include image-generation compute.** The site works for prompt compilation, local previews and Model management without an API. Real image generation and editing require a separately deployed **authenticated** image Gateway and model API billing; a Cloudflare Worker can be hosted within a free usage tier but provider model calls are not free.

1. Copy `worker/wrangler.toml.example` to `worker/wrangler.toml` and deploy using Cloudflare Wrangler (`npx wrangler deploy`), from `worker/`. Set `ALLOWED_ORIGIN` to `https://hoanggiaktsda-beep.github.io`.
2. Add **secrets** (never commit actual values): `npx wrangler secret put OPENAI_API_KEY` and `npx wrangler secret put STUDIO_ACCESS_TOKEN`.
3. In Studio, expand **Cấu hình gateway**; enter HTTPS worker URL and private Studio token, then click Generate/Edit.
4. Set a spending limit and monitor usage. Origin restrictions alone are not authorization; Worker enforces its Studio token.

**Important limitations:** Only 16 total images per API call, despite unlimited library Models. Project JSON saves metadata but not actual image bytes, so reference uploads must be repeated after reload. A result's geometric preservation is best-effort, not CAD-grade accuracy. The 48 roles are structured **prompt orchestration**, not 48 independently running ML processes. The AI connector has not been live-tested with paid credentials or deployed in a Cloudflare account.
