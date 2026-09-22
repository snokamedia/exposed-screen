import { expect, test } from "@playwright/test";

test("app renders without errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(String(e)));
	page.on("console", (msg) => {
		if (msg.type() === "error") errors.push(msg.text());
	});
	await page.goto("/");
	await expect(page.locator("h1")).toContainText("Web-exposed Screen Profiler");
	await expect(page.locator(".method")).toContainText("How detection works");
	await expect(page.locator("#screen-diagram")).toBeVisible();
	await expect(page.locator("#display-result-title")).not.toHaveText(
		"Analyzing…",
	);
	await expect(page.locator("#os-result-title")).not.toHaveText("Analyzing…");
	await expect(page.locator("#display-result-icon svg")).toBeVisible();
	await expect(page.locator("#os-result-icon svg")).toBeVisible();
	await expect(page.locator(".star-button")).toContainText("Star on GitHub");
	expect(errors).toEqual([]);
});
