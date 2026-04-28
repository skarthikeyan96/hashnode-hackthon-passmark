# I Tested StrideBoard with Passmark (Breaking Apps Hackathon)

I joined the Breaking Apps Hackathon to pressure-test a real public web app with Passmark and see how far natural-language regression testing can go before I need deterministic fallbacks.

App under test:

- `https://strideboard-rose.vercel.app/`

Hackathon:

- [Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things)

Tags:

- `#BreakingAppsHackathon`
- `#testing`
- `#playwright`
- `#automation`
- `#qa`

## Why I picked this app

StrideBoard is a great hackathon target because it is:

- public and accessible
- interaction-heavy (posting, filters, hype actions)
- simple enough to iterate quickly
- realistic enough to expose flaky automation patterns

## About StrideBoard (product context)

StrideBoard is a real-time community hype wall for runners preparing for race day.  
The core user loop is simple: post a goal, get hyped by the community, and track momentum.

What users can do:

- post goal time, optional pace, and motivation
- choose goal categories like Personal Best, Sub-60 Attempt, and First Ever Race
- react to other runners with hype (`🔥`) interactions
- follow community stats, countdown, and training progress widgets

The app is intentionally lightweight and fast to ship:

- frontend: vanilla HTML/CSS/JS
- backend: Vercel Serverless Function for Redis proxy
- data: Upstash Redis

I wrote more about building StrideBoard here:

- [How I Built a Real-Time Community Hype Wall for Runners Using Redis and Vercel](https://imkarthikeyans.hashnode.dev/how-i-built-a-real-time-community-hype-wall-for-runners-using-redis-and-vercel?utm_source=hashnode&utm_medium=feed)

## Setup

I started from a Playwright TypeScript project and added Passmark + dotenv.

```bash
npm init playwright@latest my-hackathon-tests
cd my-hackathon-tests
npm install passmark dotenv
```

In `.env`:

```bash
OPENROUTER_API_KEY=sk-or-...
```

In `playwright.config.ts`, I load dotenv and configure Passmark through OpenRouter.

## What I tested

I built a focused regression suite around user-critical flows:

1. Landing page integrity
2. Goal posting with anonymous toggle
3. Filter switching across all goal categories
4. Hype action confirmation behavior

Main spec:

- `tests/strideboard.passmark.spec.ts`

Helpers:

- `tests/helpers/strideboard.ts`

## Sample Passmark flow

Here is one of the AI-driven sections:

```ts
await runSteps({
  page,
  userFlow: "StrideBoard anonymous posting",
  steps: [
    { description: `Navigate to ${STRIDEBOARD_URL}` },
    {
      description:
        "Click the toggle Post anonymously — hide my nickname so anonymous mode is enabled",
    },
    {
      description: "In the race goal input, enter the message",
      data: { value: goalText },
    },
    {
      description: `Select the goal category ${GOAL_CATEGORIES[1]}`,
    },
    {
      description: "Click POST TO BOARD",
      waitUntil: "The newly posted goal appears on the board",
    },
  ],
  assertions: [
    {
      assertion: `You can see a posted goal containing the text ${goalText}`,
    },
  ],
  test,
  expect,
});
```

## What broke first (and how I fixed it)

The first flaky area was long AI-heavy paths for filters and hype interactions. The app was fine, but tests sometimes timed out during broad natural-language assertions.

What I changed:

- kept Passmark where it adds value (high-level posting flows)
- switched repetitive UI interactions (filter clicks) to deterministic Playwright checks
- targeted the exact newly created post before clicking hype
- used unique test data per run to avoid collisions on shared public state

This hybrid approach gave better stability without losing Passmark’s speed for authoring flows.

## Results

After tightening selectors and splitting responsibilities between AI + deterministic checks:

- suite runs consistently in Chromium
- flaky false negatives from generic modal/selector matching were removed
- report output became easier to debug and iterate on

Run commands I used:

```bash
npx playwright test tests/strideboard.passmark.spec.ts --project=chromium --reporter=list
npx playwright test tests/strideboard.passmark.spec.ts
npx playwright show-report
```

## Key learnings

- Natural-language testing is excellent for fast scenario authoring.
- Deterministic selectors are still best for repetitive or exact-state checks.
- Hybrid suites are often the sweet spot: AI for intent, Playwright for precision.

## If you are joining the hackathon

Pick a public app with real interactions, start with a thin happy-path suite, then harden the flaky edges with deterministic checks as you learn the DOM patterns.

That gives you both:

- a practical submission
- a genuinely useful regression suite you can keep improving

---

If you are building for the same hackathon, I would love to compare notes on where Passmark shines most in your app.
