import { describe, expect, it } from "vitest";
import {
	actualViewportSize,
	detectExtendedDisplay,
	estimateZoomPercent,
	isProbablyVmBySize,
	isVmRenderer,
	positionKey,
	predictOs,
} from "../../src/probes/heuristics.js";

describe("heuristics", () => {
	it("estimates zoom from DPR", () => {
		expect(estimateZoomPercent(1)).toBe(100);
		expect(estimateZoomPercent(1.25)).toBe(125);
	});

	it("computes actual viewport size", () => {
		expect(actualViewportSize(1920, 1080, 1)).toEqual({
			actualInnerWidth: 1920,
			actualInnerHeight: 1080,
		});
	});

	it("detects primary display", () => {
		const r = detectExtendedDisplay(
			{
				availTop: 0,
				availLeft: 0,
				initialLeft: 0,
				initialTop: 0,
				width: 1920,
				height: 1080,
			},
			{ actualInnerWidth: 1920, outerHeight: 1080 },
		);
		expect(r.kind).toBe("primary");
		expect(r.title).toBe("Primary display");
		expect(r.detail).toContain("primary display");
	});

	it("detects right extended display", () => {
		const r = detectExtendedDisplay(
			{
				availTop: 0,
				availLeft: 1920,
				initialLeft: 1920,
				initialTop: 0,
				width: 1920,
				height: 1080,
			},
			{ actualInnerWidth: 1920, outerHeight: 1080 },
		);
		expect(r.kind).toBe("right");
	});

	it("predicts Windows and macOS", () => {
		expect(predictOs(-40)?.label).toContain("Windows 10");
		expect(predictOs(-40)?.family).toBe("windows");
		expect(predictOs(-48)?.label).toContain("Windows 11");
		expect(predictOs(-24)?.label).toContain("macOS 11");
		expect(predictOs(-24)?.family).toBe("macos");
		expect(predictOs(0)).toBeNull();
	});

	it("flags zero-size windows as VM-like", () => {
		expect(
			isProbablyVmBySize(
				{
					outerWidth: 0,
					outerHeight: 0,
					windowWidthdiff: 0,
					windowHeightdiff: 0,
				},
				{
					availWidth: 0,
					availHeight: 0,
					width: 0,
					height: 0,
					screenHeightdiff: 0,
					screenWidthdiff: 0,
				},
			),
		).toBe(true);
	});

	it("matches VM renderers", () => {
		expect(isVmRenderer("VMware SVGA 3D")).toBe(true);
		expect(isVmRenderer("ANGLE (NVIDIA GeForce)")).toBe(false);
	});

	it("changes position key on window moves only", () => {
		const win = { outerWidth: 1920, outerHeight: 1080, devicePixelRatio: 1 };
		const scr = {
			availLeft: 0,
			availTop: 0,
			availWidth: 1920,
			availHeight: 1040,
			width: 1920,
			height: 1080,
			initialLeft: 0,
			initialTop: 0,
		};
		const base = positionKey(win, scr);
		expect(positionKey(win, scr)).toBe(base);
		expect(positionKey(win, { ...scr, initialLeft: 1920 })).not.toBe(base);
		expect(positionKey(win, { ...scr, availLeft: 1920 })).not.toBe(base);
	});
});
