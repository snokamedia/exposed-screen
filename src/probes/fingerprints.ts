import { safeProbe } from "../lib/safe.js";

export function getWebGLInfo(): {
	vendor: string;
	renderer: string;
	gpu: string;
} {
	return safeProbe(
		() => {
			const canvas = document.createElement("canvas");
			const gl =
				canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
			if (!gl || !(gl instanceof WebGLRenderingContext)) {
				return {
					vendor: "Not Available",
					renderer: "Not Available",
					gpu: "Not Available",
				};
			}
			const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
			let vendor = "Not Available";
			let renderer = gl.getParameter(gl.RENDERER) as string;
			if (debugInfo) {
				vendor = String(
					gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) ?? vendor,
				);
				renderer = String(
					gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? renderer,
				);
			}
			const version = String(gl.getParameter(gl.VERSION) ?? "");
			return { vendor, renderer, gpu: `${renderer} - ${version}` };
		},
		{
			vendor: "Not Available",
			renderer: "Not Available",
			gpu: "Not Available",
		},
	);
}
