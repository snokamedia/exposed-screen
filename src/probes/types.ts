export interface WindowProps {
	menubar: boolean;
	toolbar: boolean;
	statusbar: boolean;
	scrollbars: boolean;
	personalbar: boolean;
	locationbar: boolean;
	innerWidth: number;
	innerHeight: number;
	actualInnerWidth: number;
	actualInnerHeight: number;
	outerWidth: number;
	outerHeight: number;
	devicePixelRatio: number;
	windowHeightdiff: number;
	windowWidthdiff: number;
}

export interface ScreenProps {
	availWidth: number;
	availHeight: number;
	width: number;
	height: number;
	screenHeightdiff: number;
	screenWidthdiff: number;
	initialLeft: number;
	initialTop: number;
	availLeft: number;
	compLeft: number;
	availTop: number;
	compTop: number;
	colorDepth: number;
	pixelDepth: number;
	orientation: string;
}

export interface ExtendedDisplayResult {
	kind: "primary" | "right" | "left" | "top" | "bottom" | "unknown";
	title: string;
	detail: string;
}

type OsFamily = "windows" | "macos";

export interface OsPrediction {
	/** Display name, e.g. "Windows 11". */
	label: string;
	family: OsFamily;
	alignAvailEnd: boolean;
}
