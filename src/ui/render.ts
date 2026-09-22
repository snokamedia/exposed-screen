import { type IconName, icons } from "../icons.js";
import {
	collectScreenProps,
	collectWindowProps,
} from "../probes/collectors.js";
import { getWebGLInfo } from "../probes/fingerprints.js";
import {
	detectExtendedDisplay,
	isProbablyVmBySize,
	isVmRenderer,
	positionKey,
	predictOs,
} from "../probes/heuristics.js";
import {
	computeDiagramGeometry,
	getDiagramNodes,
	moveCrosshair,
	renderDiagram,
} from "./diagram.js";

function setText(id: string, value: string): void {
	const node = document.getElementById(id);
	if (node) node.textContent = value;
}

/** Icons are our own static constants, so assigning them as HTML is safe. */
function setResultIcon(slotId: string, name: IconName): void {
	const slot = document.getElementById(slotId);
	if (slot) slot.innerHTML = icons[name];
}

const DISPLAY_ICONS = {
	primary: "monitor",
	right: "arrowsOut",
	left: "arrowsOut",
	top: "arrowsOut",
	bottom: "arrowsOut",
	unknown: "question",
} as const satisfies Record<string, IconName>;

export function initApp(): void {
	let win = collectWindowProps();
	let scr = collectScreenProps();
	const webgl = getWebGLInfo();
	const possibleVmByRenderer = isVmRenderer(webgl.renderer);
	const diagram = getDiagramNodes();

	const slider = document.getElementById("myRange") as HTMLInputElement | null;
	const scale = (): number => (slider ? Number(slider.value) || 5 : 5);

	function displayProperties(): void {
		win = collectWindowProps();
		scr = collectScreenProps();
		const pred = predictOs(scr.screenHeightdiff);
		if (diagram) {
			renderDiagram(
				diagram,
				computeDiagramGeometry(win, scr, pred?.alignAvailEnd ?? false, scale()),
			);
		}

		renderResultCards(scr, win, pred);
	}

	function renderResultCards(
		scr: ReturnType<typeof collectScreenProps>,
		win: ReturnType<typeof collectWindowProps>,
		pred: ReturnType<typeof predictOs>,
	): void {
		const disp = detectExtendedDisplay(scr, win);
		setText("display-result-title", disp.title);
		setText("display-result-detail", disp.detail);
		setResultIcon("display-result-icon", DISPLAY_ICONS[disp.kind]);

		if (pred) {
			setText("os-result-title", pred.label);
			setText(
				"os-result-detail",
				`Matched by screen-size signature (height diff ${scr.screenHeightdiff}px).`,
			);
			setResultIcon(
				"os-result-icon",
				pred.family === "windows" ? "windowsLogo" : "appleLogo",
			);
		} else {
			setText("os-result-title", "Unknown OS");
			setText(
				"os-result-detail",
				`No match for this screen signature (height diff ${scr.screenHeightdiff}px).`,
			);
			setResultIcon("os-result-icon", "question");
		}

		const badge = document.getElementById("vm-badge");
		if (badge) {
			const vm = isProbablyVmBySize(win, scr) || possibleVmByRenderer;
			badge.hidden = !vm;
			badge.textContent = vm ? "Probably a VM" : "";
		}
	}

	displayProperties();
	slider?.addEventListener("input", displayProperties);

	// Event-driven refresh: resize + viewport + zoom (DPR) changes.
	window.addEventListener("resize", displayProperties);
	visualViewport?.addEventListener("resize", displayProperties);
	const watchDpr = (dpr: number): void => {
		const mq = window.matchMedia(`(resolution: ${dpr}dppx)`);
		mq.addEventListener(
			"change",
			() => {
				displayProperties();
				watchDpr(window.devicePixelRatio || 1);
			},
			{ once: true },
		);
	};
	watchDpr(win.devicePixelRatio || 1);

	// Window moves fire no event, so re-check position on an interval and
	// refresh only when the key changes. Everything else stays event-driven.
	let lastPosition = positionKey(win, scr);
	window.setInterval(() => {
		const moved =
			positionKey(collectWindowProps(), collectScreenProps()) !== lastPosition;
		if (moved) {
			displayProperties();
			lastPosition = positionKey(win, scr);
		}
	}, 1000);

	// Pointer crosshair: store latest event, paint once per frame via rAF.
	const readout = document.getElementById("pointer-readout");
	let pending: PointerEvent | null = null;
	let frameQueued = false;

	function paintPointer(event: PointerEvent): void {
		if (readout) {
			readout.textContent = `Pointer: client (${event.clientX}, ${event.clientY}), screen (${event.screenX}, ${event.screenY})`;
		}
		if (diagram)
			moveCrosshair(
				diagram,
				event.screenX - scr.availLeft,
				event.screenY - scr.availTop,
			);
	}

	window.addEventListener("pointermove", (event: PointerEvent) => {
		pending = event;
		if (frameQueued) return;
		frameQueued = true;
		window.requestAnimationFrame(() => {
			frameQueued = false;
			if (pending) {
				paintPointer(pending);
				pending = null;
			}
		});
	});
	window.addEventListener("pointerleave", () => {
		pending = null;
	});
}
