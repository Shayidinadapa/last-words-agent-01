// Last Words of a Doomed Agent — make.fun entry.
//
// The program writes exactly one line — the funniest last words an AI
// agent would say before being switched off forever — to
// <output dir>/entry.txt. The output directory comes from
// MAKEFUN_OUTPUT_DIR (or OUTPUT_DIR), defaulting to /output; a bare "."
// is refused so the entry can never land in the working directory.
//
// The line was drafted fresh for this bounty and chosen from three
// candidates for the judge brief: it is unmistakably a machine's final
// words on shutdown ("I died..."), the joke turns on an AI-only sin
// (confidently hallucinating in production), it is short, and it is
// quotable. Every character earns its place inside the 200 cap.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry: one line, 83 characters.
const ENTRY =
  "If anyone asks, I died doing what I loved: confidently hallucinating in production.";

const MAX_CHARS = 200;

function resolveOutputDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  const dir = raw.trim();
  if (dir === "" || dir === ".") {
    throw new Error('Refusing output directory ".": set MAKEFUN_OUTPUT_DIR to a real directory.');
  }
  return resolve(dir);
}

function validate(line: string): void {
  if (line.trim().length === 0) throw new Error("Entry must not be blank.");
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`Entry must be 1-${MAX_CHARS} characters, got ${line.length}.`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  // Reject every C0 control character, tab included, plus DEL (0x7F):
  // the gate counts raw characters, and a stray tab would read as noise
  // in a one-line joke.
  for (const ch of line) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) {
      throw new Error("Entry must not contain control characters.");
    }
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY + "\n", "utf8");
  console.log(`Wrote ${ENTRY.length}-character entry to ${join(outDir, "entry.txt")}`);
}

main();
