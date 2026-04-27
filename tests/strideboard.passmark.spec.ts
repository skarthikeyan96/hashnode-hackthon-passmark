import { expect, test, type Page } from "@playwright/test";
import { runSteps } from "passmark";
import {
  FILTER_LABELS,
  GOAL_CATEGORIES,
  STRIDEBOARD_URL,
  uniqueGoalText,
} from "./helpers/strideboard";

test.use({
  headless: !!process.env.CI,
});

test.describe("StrideBoard Passmark regression suite", () => {
  async function clickHypeForPostedGoal(page: Page, goalText: string) {
    const goalCard = page.locator("div").filter({ hasText: `"${goalText}"` }).first();
    await expect(goalCard).toBeVisible();

    const hypeButton = goalCard.getByRole("button", { name: /^🔥\s*\d+/ }).first();
    await expect(hypeButton).toBeVisible();
    await hypeButton.click();
  }

  test("landing content and race info render", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(STRIDEBOARD_URL, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/strideboard-rose\.vercel\.app/);
    await expect(page.getByText("StrideBoard")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Drop Your Race Goal/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /POST TO BOARD/i })).toBeVisible();
    await expect(page.getByText("COMMUNITY STATS")).toBeVisible();
    await expect(page.getByText("RACE INFO")).toBeVisible();
    await expect(page.getByText("COUNTDOWN")).toBeVisible();
    await expect(page.getByText("10 Kilometers")).toBeVisible();
  });

  test("posting a goal with anonymous toggle works", async ({ page }) => {
    test.setTimeout(150_000);
    const goalText = uniqueGoalText("Passmark anonymous goal");

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

    await expect(page.getByText("TOP HYPED")).toBeVisible();
  });

  test("goal filters are clickable and keep board stable", async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto(STRIDEBOARD_URL, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("TOP HYPED")).toBeVisible();

    for (const label of FILTER_LABELS) {
      await page.getByRole("button", { name: label }).click();
      await expect(page.getByText("TOP HYPED")).toBeVisible();
    }

    await page.getByRole("button", { name: "All Goals" }).click();
    await expect(page.getByRole("button", { name: "All Goals" })).toBeVisible();
    await expect(page.getByText("TOP HYPED")).toBeVisible();
  });

  test("hype action shows confirmation modal", async ({ page }) => {
    test.setTimeout(90_000);
    const hypeGoal = uniqueGoalText("Passmark hype candidate");

    await runSteps({
      page,
      userFlow: "StrideBoard hype confirmation",
      steps: [
        { description: `Navigate to ${STRIDEBOARD_URL}` },
        {
          description: "In the race goal input, enter the message",
          data: { value: hypeGoal },
        },
        {
          description: `Select the goal category ${GOAL_CATEGORIES[0]}`,
        },
        {
          description: "Click POST TO BOARD",
          waitUntil: `A post containing ${hypeGoal} is visible on the board`,
        },
      ],
      test,
      expect,
    });

    await clickHypeForPostedGoal(page, hypeGoal);
    await expect(page.getByRole("button", { name: "CLOSE" })).toBeVisible();
  });
});
