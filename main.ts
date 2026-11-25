// make.fun entry: Fortune Cookies for Machines
// Reads the single fortune line from line.txt next to this file and emits
// those exact bytes to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function loadFortune(): string {
  const raw = readFileSync(join(sourceDir, "line.txt"), "utf8");
  const line = raw.endsWith("\n") ? raw.slice(0, -1) : raw;
  if (line.length < 1 || line.length > 200) {
    throw new Error(`fortune must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("fortune must be a single line");
  }
  const terminators = line.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1) {
    throw new Error("fortune must be exactly one sentence");
  }
  return line;
}

const fortune = loadFortune();
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "entry.txt"), fortune, "utf8");
console.log(fortune);
