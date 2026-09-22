import type { ScreenProps, WindowProps } from "../probes/types.js";

interface DiagramRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface DiagramGeometry {
	viewBox: string;
	screen: DiagramRect;
	avail: DiagramRect;
	outer: DiagramRect;
	inner: DiagramRect;
	displayWidth: number;
}

/** Default slider value; also the normalization baseline for display width. */
const DEFAULT_SCALE = 5;

/** Pure geometry in the current screen's local frame + a padded viewBox covering the rects. */
export function computeDiagramGeometry(
	win: Pick<
		WindowProps,
		"actualInnerWidth" | "actualInnerHeight" | "outerWidth" | "outerHeight"
	>,
	scr: Pick<
		ScreenProps,
		"width" | "height" | "availWidth" | "availHeight" | "compLeft" | "compTop"
	>,
	alignAvailEnd: boolean,
	scale: number,
): DiagramGeometry {
	const pad = 24;
	const s = scale || 5;
	// Screen-local frame (legacy "Extended Display Compensation"): the screen
	// sits at the origin with avail nested inside it, and the window is placed
	// by its compensation offset (position relative to the avail origin).
	// Virtual-desktop coords (availLeft/availTop/initialLeft) must NOT be used
	// directly here, or the boxes detach on extended displays.
	const availY = alignAvailEnd ? scr.height - scr.availHeight : 0;
	const outer: DiagramRect = {
		x: scr.compLeft,
		y: scr.compTop,
		w: win.outerWidth,
		h: win.outerHeight,
	};
	const inner: DiagramRect = {
		x: outer.x,
		y: outer.y + Math.max(0, win.outerHeight - win.actualInnerHeight),
		w: win.actualInnerWidth,
		h: win.actualInnerHeight,
	};
	const screen: DiagramRect = { x: 0, y: 0, w: scr.width, h: scr.height };
	const avail: DiagramRect = {
		x: 0,
		y: availY,
		w: scr.availWidth,
		h: scr.availHeight,
	};
	const minX = Math.min(screen.x, avail.x, outer.x) - pad;
	const minY = Math.min(screen.y, avail.y, outer.y) - pad;
	const maxX =
		Math.max(screen.x + screen.w, avail.x + avail.w, outer.x + outer.w) + pad;
	const maxY =
		Math.max(screen.y + screen.h, avail.y + avail.h, outer.y + outer.h) + pad;
	return {
		viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
		screen,
		avail,
		outer,
		inner,
		// Slider value is a zoom factor: dragging right must enlarge the
		// diagram. Normalized so the default value 5 keeps the legacy size.
		displayWidth: ((maxX - minX) * s) / (DEFAULT_SCALE * DEFAULT_SCALE),
	};
}

export interface DiagramNodes {
	svg: SVGSVGElement;
	screen: SVGRectElement;
	avail: SVGRectElement;
	outer: SVGRectElement;
	inner: SVGRectElement;
	crosshair: SVGGElement;
}

export function getDiagramNodes(): DiagramNodes | null {
	const svg = document.getElementById("screen-diagram");
	if (!(svg instanceof SVGSVGElement)) return null;
	const byId = (id: string): SVGRectElement | null => {
		const node = document.getElementById(id);
		return node instanceof SVGRectElement ? node : null;
	};
	const screen = byId("rect-screen");
	const avail = byId("rect-avail");
	const outer = byId("rect-outer");
	const inner = byId("rect-inner");
	const crosshair = document.getElementById("crosshair");
	if (
		!screen ||
		!avail ||
		!outer ||
		!inner ||
		!(crosshair instanceof SVGGElement)
	) {
		return null;
	}
	return { svg, screen, avail, outer, inner, crosshair };
}

function setRect(node: SVGRectElement, r: DiagramRect): void {
	node.setAttribute("x", String(r.x));
	node.setAttribute("y", String(r.y));
	node.setAttribute("width", String(Math.max(0, r.w)));
	node.setAttribute("height", String(Math.max(0, r.h)));
}

export function renderDiagram(nodes: DiagramNodes, geo: DiagramGeometry): void {
	nodes.svg.setAttribute("viewBox", geo.viewBox);
	setRect(nodes.screen, geo.screen);
	setRect(nodes.avail, geo.avail);
	setRect(nodes.outer, geo.outer);
	setRect(nodes.inner, geo.inner);
	nodes.svg.style.width = `${geo.displayWidth}px`;
}

export function moveCrosshair(nodes: DiagramNodes, x: number, y: number): void {
	nodes.crosshair.setAttribute("transform", `translate(${x} ${y})`);
	nodes.crosshair.style.visibility = "visible";
}
