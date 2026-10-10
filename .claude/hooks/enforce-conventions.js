// PreToolUse hook (Write|Edit|MultiEdit): blocks forbidden patterns in test
// code before they hit disk. Rules mirror docs/playwright-best-practices.md
// and CLAUDE.md. Exit 2 = block and feed stderr back to Claude.
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const ti = input.tool_input || {};
  const file = String(ti.file_path || '').split(String.fromCharCode(92)).join('/');
  if (!/\/tests\/.*\.ts$/.test(file)) process.exit(0);

  const chunks = [ti.content, ti.new_string, ...(ti.edits || []).map((e) => e.new_string)].filter(
    (s) => typeof s === 'string',
  );
  const code = chunks.join('\n');
  const isSpec = /\.spec\.ts$/.test(file);

  const rules = [
    [/\bwaitForTimeout\s*\(/, 'No hard waits (page.waitForTimeout). Use web-first assertions or waitForResponse.'],
    [/(:\s*any\b|\bas\s+any\b|<any>)/, 'No `any`. Use a real type or `unknown`.'],
    [/(locator\(\s*['"`](\/\/|xpath=))|\bxpath\b/i, 'No XPath. Use getByRole/getByLabel/getByText/getByTestId.'],
    [/\.only\s*\(/, 'Do not commit test.only / describe.only.'],
  ];
  if (isSpec) {
    rules.push([
      /from\s+['"]@playwright\/test['"]/,
      "Specs must import test/expect from '../fixtures' or '../fixtures-authenticated', not '@playwright/test'.",
    ]);
  }

  const hits = rules.filter(([re]) => re.test(code)).map(([, msg]) => `- ${msg}`);
  if (hits.length) {
    process.stderr.write(`Blocked write to ${file}:\n${hits.join('\n')}\n`);
    process.exit(2);
  }
  process.exit(0);
});
