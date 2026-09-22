import { icons } from "./icons.js";
import { initApp } from "./ui/render.js";
import "./styles/tokens.css";

function hydrateIcons(): void {
	for (const node of document.querySelectorAll<HTMLElement>("[data-icon]")) {
		const name = node.dataset.icon as keyof typeof icons | undefined;
		if (name && name in icons)
			node.insertAdjacentHTML("afterbegin", icons[name]);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	hydrateIcons();
	initApp();
});
