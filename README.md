# StrideBoard Passmark Test Suite

Passmark + Playwright regression suite for:

- `https://strideboard-rose.vercel.app/`

This repository was built as a submission project for the Breaking Apps Hackathon.

## Hackathon Context

- Hackathon: Breaking Apps Hackathon
- Track: Passmark-based regression testing on public web apps
- Reference: [Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things)

## What This Suite Tests

- Landing page integrity (core sections and race info visible)
- Goal posting flow (including anonymous toggle path)
- Goal filter interactions (`All Goals`, `PB`, `Sub-60`, `First Race`, `Finish`, `Comeback`)
- Hype flow validation on a newly created post

## Tech Stack

- Playwright (`@playwright/test`)
- Passmark (`runSteps`)
- TypeScript
- dotenv

## Prerequisites

- Node.js 18+
- Dependencies installed with `npm install`
- Valid API key for configured Passmark gateway

## Environment Setup

Create a `.env` file in the project root.

Current config uses OpenRouter:

```bash
OPENROUTER_API_KEY=sk-or-...
```

Optional fallback for direct provider setup:

```bash
ANTHROPIC_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Install and Run

Install dependencies:

```bash
npm install
```

Run Chromium only:

```bash
npx playwright test tests/strideboard.passmark.spec.ts --project=chromium --reporter=list
```

Run all configured browsers:

```bash
npx playwright test tests/strideboard.passmark.spec.ts
```

Open HTML report:

```bash
npx playwright show-report
```

## Reliability Notes

- Uses unique per-run goal text to avoid collisions on shared public state.
- Mixes Passmark natural-language flows with deterministic Playwright checks for stability.
- Targets the exact newly created post before running the hype action.

## Project Structure

- `tests/strideboard.passmark.spec.ts` - end-to-end suite
- `tests/helpers/strideboard.ts` - constants and unique data helpers
- `playwright.config.ts` - Playwright + Passmark gateway config

## Submission Checklist

- [ ] Star and fork `bug0inc/passmark`
- [ ] Push this project to your GitHub repo
- [ ] Publish Hashnode post with `#BreakingAppsHackathon`
- [ ] Share the post on X or LinkedIn and tag Bug0
