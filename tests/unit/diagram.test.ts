import { describe, expect, it } from "vitest";
import { computeDiagramGeometry } from "../../src/ui/diagram.js";

const win = {
	actualInnerWidth: 1840,
	actualInnerHeight: 900,
	outerWidth: 1920,
	outerHeight: 1040,
};
const scr = {
	width: 1920,
	height: 1080,
	availWidth: 1920,
	availHeight: 1040,
	compLeft: 0,
	compTop: 0,
};

describe("computeDiagramGeometry", () => {
	it("covers screen with padding and scales display width", () => {
		const geo = computeDiagramGeometry(win, scr, false, 5);
		expect(geo.viewBox).toBe("-24 -24 1968 1128");
		expect(geo.screen).toEqual({ x: 0, y: 0, w: 1920, h: 1080 });
		expect(geo.displayWidth).toBeCloseTo(1968 / 5);
	});

	it("grows display width as the scale slider moves right", () => {
		const small = computeDiagramGeometry(win, scr, false, 1.5);
		const mid = computeDiagramGeometry(win, scr, false, 5);
		const large = computeDiagramGeometry(win, scr, false, 7);
		expect(small.displayWidth).toBeLessThan(mid.displayWidth);
		expect(mid.displayWidth).toBeLessThan(large.displayWidth);
		expect(mid.displayWidth).toBeCloseTo(1968 / 5);
	});

	it("anchors avail rect to bottom on macOS-style prediction", () => {
		const geo = computeDiagramGeometry({ ...win }, { ...scr }, true, 5);
		expect(geo.avail.y).toBe(1080 - 1040);
	});

	it("compensates window position on right extended display", () => {
		const geo = computeDiagramGeometry(
			win,
			{
				width: scr.width,
				height: scr.height,
				availWidth: scr.availWidth,
				availHeight: scr.availHeight,
				compLeft: 80,
				compTop: 100,
			},
			false,
			4,
		);
		// Screen-local frame: screen and avail nested at the origin, window
		// offset by its compensation (position relative to avail origin).
		expect(geo.avail).toMatchObject({ x: 0, y: 0 });
		expect(geo.outer).toMatchObject({ x: 80, y: 100 });
		expect(geo.viewBox).toBe("-24 -24 2048 1188");
	});
});
