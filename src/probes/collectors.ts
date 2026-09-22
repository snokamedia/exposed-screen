import { safeProbe } from "../lib/safe.js";
import { actualViewportSize } from "./heuristics.js";
import type { ScreenProps, WindowProps } from "./types.js";

export function collectWindowProps(): WindowProps {
	const dpr = safeProbe(() => window.devicePixelRatio || 1, 1);
	const { actualInnerWidth, actualInnerHeight } = actualViewportSize(
		window.innerWidth,
		window.innerHeight,
		dpr,
	);
	return {
		menubar: safeProbe(() => window.menubar.visible, false),
		toolbar: safeProbe(() => window.toolbar.visible, false),
		statusbar: safeProbe(() => window.statusbar.visible, false),
		scrollbars: safeProbe(() => window.scrollbars.visible, false),
		personalbar: safeProbe(() => window.personalbar.visible, false),
		locationbar: safeProbe(() => window.locationbar.visible, false),
		innerWidth: window.innerWidth,
		innerHeight: window.innerHeight,
		actualInnerWidth,
		actualInnerHeight,
		outerWidth: window.outerWidth,
		outerHeight: window.outerHeight,
		devicePixelRatio: dpr,
		windowHeightdiff: window.outerHeight - Math.round(window.innerHeight / dpr),
		windowWidthdiff: window.outerWidth - Math.round(window.innerWidth / dpr),
	};
}

export function collectScreenProps(): ScreenProps {
	// availLeft/availTop are non-standard (Firefox); absent elsewhere.
	const screenExt = window.screen as Screen & {
		availLeft?: number;
		availTop?: number;
	};
	const availLeft = safeProbe(() => screenExt.availLeft ?? 0, 0);
	const availTop = safeProbe(() => screenExt.availTop ?? 0, 0);
	const initialLeft = safeProbe(
		() => window.screenLeft ?? window.screenX ?? 0,
		0,
	);
	const initialTop = safeProbe(
		() => window.screenTop ?? window.screenY ?? 0,
		0,
	);
	return {
		availWidth: window.screen.availWidth,
		availHeight: window.screen.availHeight,
		width: window.screen.width,
		height: window.screen.height,
		screenHeightdiff: window.screen.availHeight - window.screen.height,
		screenWidthdiff: window.screen.availWidth - window.screen.width,
		initialLeft,
		initialTop,
		availLeft,
		compLeft: initialLeft - availLeft,
		availTop,
		compTop: initialTop - availTop,
		colorDepth: window.screen.colorDepth,
		pixelDepth: window.screen.pixelDepth,
		orientation: safeProbe(
			() => (screen.orientation ? screen.orientation.type : "Not Available"),
			"Not Available",
		),
	};
}
