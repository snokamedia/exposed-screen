import type {
	ExtendedDisplayResult,
	OsPrediction,
	ScreenProps,
	WindowProps,
} from "./types.js";

export function estimateZoomPercent(devicePixelRatio: number): number {
	return Math.round(devicePixelRatio * 100);
}

export function actualViewportSize(
	innerWidth: number,
	innerHeight: number,
	dpr: number,
) {
	const ratio = dpr || 1;
	return {
		actualInnerWidth: Math.round(innerWidth / ratio),
		actualInnerHeight: Math.round(innerHeight / ratio),
	};
}

export function detectExtendedDisplay(
	screen: Pick<
		ScreenProps,
		"availTop" | "availLeft" | "initialLeft" | "initialTop" | "width" | "height"
	>,
	win: Pick<WindowProps, "actualInnerWidth" | "outerHeight">,
): ExtendedDisplayResult {
	if (screen.availTop === 0 && screen.availLeft === 0) {
		return {
			kind: "primary",
			title: "Primary display",
			detail: "This window is on the primary display.",
		};
	}
	if (screen.initialLeft >= screen.width) {
		return {
			kind: "right",
			title: "Extended display on the right",
			detail: `Probably on the right extended display. The primary display width is probably ${screen.availLeft}px.`,
		};
	}
	if (Math.abs(screen.initialLeft) >= win.actualInnerWidth) {
		return {
			kind: "left",
			title: "Extended display on the left",
			detail: "Probably on the left extended display.",
		};
	}
	if (
		Math.sign(screen.availTop) === -1 &&
		Math.abs(screen.initialTop) >= win.outerHeight
	) {
		return {
			kind: "top",
			title: "Extended display above",
			detail: "Probably on the top extended display.",
		};
	}
	if (screen.initialTop >= screen.height) {
		return {
			kind: "bottom",
			title: "Extended display below",
			detail: `Probably on the bottom extended display. The primary display height is probably ${screen.availTop}px.`,
		};
	}
	return {
		kind: "unknown",
		title: "Display position unknown",
		detail: "Could not determine which display this window is on.",
	};
}

const WIN10_DIFFS = new Set([-40, -81, -122, -163, -204, -245, -286, -327]);
const WIN11_DIFFS = new Set([-32, -48, -72]);

export function predictOs(screenHeightdiff: number): OsPrediction | null {
	if (WIN10_DIFFS.has(screenHeightdiff)) {
		return { label: "Windows 10", family: "windows", alignAvailEnd: false };
	}
	if (WIN11_DIFFS.has(screenHeightdiff)) {
		return { label: "Windows 11", family: "windows", alignAvailEnd: false };
	}
	if (screenHeightdiff === -21) {
		return {
			label: "macOS 10.4 to 10.9",
			family: "macos",
			alignAvailEnd: true,
		};
	}
	if (screenHeightdiff === -22) {
		return {
			label: "macOS 10.10 to 10.15",
			family: "macos",
			alignAvailEnd: true,
		};
	}
	if (screenHeightdiff === -24) {
		return {
			label: "macOS 11 and later",
			family: "macos",
			alignAvailEnd: true,
		};
	}
	return null;
}

export function isProbablyVmBySize(
	win: Pick<
		WindowProps,
		"outerWidth" | "outerHeight" | "windowWidthdiff" | "windowHeightdiff"
	>,
	screen: Pick<
		ScreenProps,
		| "availWidth"
		| "availHeight"
		| "width"
		| "height"
		| "screenHeightdiff"
		| "screenWidthdiff"
	>,
): boolean {
	if (win.outerWidth === 0 && win.outerHeight === 0) return true;
	if (
		win.windowWidthdiff <= -150 ||
		win.windowHeightdiff <= -200 ||
		win.windowWidthdiff >= 300
	) {
		return true;
	}
	if (
		win.outerWidth === 800 &&
		win.outerHeight === 600 &&
		screen.availWidth === 800 &&
		screen.availHeight === 600 &&
		screen.width === 800 &&
		screen.height === 600 &&
		screen.screenHeightdiff === 0 &&
		screen.screenWidthdiff === 0
	) {
		return true;
	}
	return false;
}

const VM_RENDERER = [
	/VirtualBox/i,
	/VMware/i,
	/Parallels/i,
	/QEMU/i,
	/Virtual/i,
];

export function isVmRenderer(renderer: string): boolean {
	return VM_RENDERER.some((re) => re.test(renderer));
}

/**
 * Compact signature of everything that changes when the browser window moves
 * between monitors. No event fires for a window move, so the app re-checks
 * this key on an interval and refreshes only when it changes.
 */
export function positionKey(
	win: Pick<WindowProps, "outerWidth" | "outerHeight" | "devicePixelRatio">,
	screen: Pick<
		ScreenProps,
		| "availLeft"
		| "availTop"
		| "availWidth"
		| "availHeight"
		| "width"
		| "height"
		| "initialLeft"
		| "initialTop"
	>,
): string {
	return [
		win.outerWidth,
		win.outerHeight,
		win.devicePixelRatio,
		screen.availLeft,
		screen.availTop,
		screen.availWidth,
		screen.availHeight,
		screen.width,
		screen.height,
		screen.initialLeft,
		screen.initialTop,
	].join(",");
}
