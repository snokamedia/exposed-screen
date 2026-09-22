import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = dirname(
	fileURLToPath(new URL("../package.json", import.meta.url)),
);
const assets = join(root, "dist", "assets");
let files = [];
try {
	files = readdirSync(assets).filter((f) => f.endsWith(".js"));
} catch {
	console.log(
		"size check skipped: dist/assets missing (run npm run build first)",
	);
	process.exit(0);
}

let bytes = 0;
for (const f of files) {
	bytes += gzipSync(readFileSync(join(assets, f))).length;
}
const kb = bytes / 1024;
console.log(`gzipped JS: ${kb.toFixed(1)} KB (budget 40 KB)`);
if (bytes > 40 * 1024) {
	console.error("Bundle budget exceeded");
	process.exit(1);
}
