#!/usr/bin/env node
// Claude Code statusLine script for this project.
// Reads the JSON payload Claude Code pipes on stdin and prints a single
// status line: model name + a visual context-window usage bar.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  render(raw);
});

// Defensive fallback in case stdin closes with no data.
process.stdin.on("error", () => render(raw));

function render(raw) {
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    data = {};
  }

  const modelName =
    data?.model?.display_name || data?.model?.id || "unknown-model";

  const cw = data?.context_window || {};
  let usedPct = cw.used_percentage;

  if (usedPct === null || usedPct === undefined) {
    const total =
      (cw.total_input_tokens || 0) + (cw.total_output_tokens || 0);
    const size = cw.context_window_size;
    if (size) {
      usedPct = (total / size) * 100;
    }
  }

  const bar = renderBar(usedPct);
  const pctLabel =
    usedPct === null || usedPct === undefined
      ? "n/a"
      : `${usedPct.toFixed(0)}%`;

  process.stdout.write(`${modelName} | Context: ${bar} ${pctLabel}`);
}

function renderBar(pct, width = 20) {
  if (pct === null || pct === undefined || Number.isNaN(pct)) {
    return "░".repeat(width);
  }
  const clamped = Math.max(0, Math.min(100, pct));
  const filled = Math.round((clamped / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
