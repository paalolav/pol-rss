import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const expectedFingerprints = new Set([
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:dist/pol-rss-gallery-web-part_9a274d464d52c63dcd62.js:generic-api-key:23',
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:ppllm.prompt.txt:generic-api-key:1682',
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:ppllm.prompt.txt:generic-api-key:3099',
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:ppllm.prompt.txt:generic-api-key:3531',
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:release/assets/pol-rss-gallery-web-part_9a274d464d52c63dcd62.js:generic-api-key:23',
  '055806a56a3a9cbfb55dbf03ea128a04c7043dff:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_9a274d464d52c63dcd62.js:generic-api-key:23',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:dist/pol-rss-gallery-web-part_1a8dc6822d561e3beb4d.js:generic-api-key:16',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:dist/pol-rss-gallery-web-part_795a4e63cbec1b5b0d85.js:generic-api-key:16',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:dist/pol-rss-gallery-web-part_a0790cfdb2c435079a0e.js:generic-api-key:15',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:dist/pol-rss-gallery-web-part_f6ba1db1803efa6b13a0.js:generic-api-key:15',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:release/assets/pol-rss-gallery-web-part_1a8dc6822d561e3beb4d.js:generic-api-key:16',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:release/assets/pol-rss-gallery-web-part_795a4e63cbec1b5b0d85.js:generic-api-key:16',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:release/assets/pol-rss-gallery-web-part_a0790cfdb2c435079a0e.js:generic-api-key:15',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:release/assets/pol-rss-gallery-web-part_f6ba1db1803efa6b13a0.js:generic-api-key:15',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_795a4e63cbec1b5b0d85.js:generic-api-key:16',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_a0790cfdb2c435079a0e.js:generic-api-key:15',
  '240263807505c7a90c6f01c487bb3e05d3fa1b78:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_f6ba1db1803efa6b13a0.js:generic-api-key:15',
  '59690343b575a6064108d371fedbc7c1c6e5b7d5:dist/pol-rss-gallery-web-part_4c2e2180d01ef12aafdd.js:generic-api-key:17',
  '59690343b575a6064108d371fedbc7c1c6e5b7d5:release/assets/pol-rss-gallery-web-part_4c2e2180d01ef12aafdd.js:generic-api-key:17',
  '59690343b575a6064108d371fedbc7c1c6e5b7d5:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_4c2e2180d01ef12aafdd.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:dist/pol-rss-gallery-web-part_262fba7771c6d4b9e9d2.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:dist/pol-rss-gallery-web-part_ef2c3465af7b1e2f5c73.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:release/assets/pol-rss-gallery-web-part_262fba7771c6d4b9e9d2.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:release/assets/pol-rss-gallery-web-part_ef2c3465af7b1e2f5c73.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_262fba7771c6d4b9e9d2.js:generic-api-key:17',
  '710d36b70887e94d62982adbbe3a44e822437d55:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_ef2c3465af7b1e2f5c73.js:generic-api-key:17',
  '92eefb1b9b8eb81247a03ac357d6e2dea716b340:dist/pol-rss-gallery-web-part_9b7418e09e1db22c9ac0.js:generic-api-key:17',
  '92eefb1b9b8eb81247a03ac357d6e2dea716b340:release/assets/pol-rss-gallery-web-part_9b7418e09e1db22c9ac0.js:generic-api-key:17',
  '92eefb1b9b8eb81247a03ac357d6e2dea716b340:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_9b7418e09e1db22c9ac0.js:generic-api-key:17',
  'a6b2a467c09a3cb263eaf4bb622063f786e85a8c:dist/pol-rss-gallery-web-part_a003538497886cf0e7b8.js:generic-api-key:17',
  'a6b2a467c09a3cb263eaf4bb622063f786e85a8c:release/assets/pol-rss-gallery-web-part_a003538497886cf0e7b8.js:generic-api-key:17',
  'a6b2a467c09a3cb263eaf4bb622063f786e85a8c:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_74d286562dcf3109ad2f.js:generic-api-key:17',
  'a6b2a467c09a3cb263eaf4bb622063f786e85a8c:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_a003538497886cf0e7b8.js:generic-api-key:17',
  'a6b2a467c09a3cb263eaf4bb622063f786e85a8c:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_b03aa897614f55b08db9.js:generic-api-key:17',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:dist/pol-rss-gallery-web-part_fefd74de8b7d7d612306.js:generic-api-key:25',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:ppllm.prompt.txt:generic-api-key:1437',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:ppllm.prompt.txt:generic-api-key:5609',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:ppllm.prompt.txt:generic-api-key:6148',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:release/assets/pol-rss-gallery-web-part_fefd74de8b7d7d612306.js:generic-api-key:25',
  'b0535f4c6f223e6fcabbb201c6f0c4145fb2107a:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_fefd74de8b7d7d612306.js:generic-api-key:25',
  'b24fbdcf78c9c64a11c9ea26c8d404f267525755:dist/pol-rss-gallery-web-part_5bd2e436d14f52f29ec8.js:generic-api-key:23',
  'b24fbdcf78c9c64a11c9ea26c8d404f267525755:release/assets/pol-rss-gallery-web-part_5bd2e436d14f52f29ec8.js:generic-api-key:23',
  'b24fbdcf78c9c64a11c9ea26c8d404f267525755:sharepoint/solution/debug/ClientSideAssets/pol-rss-gallery-web-part_5bd2e436d14f52f29ec8.js:generic-api-key:23',
  'd81404bd958c30656a9fc8fcb0fcd9314c7cef0f:tests/services/proxyService.test.ts:generic-api-key:246',
]);

const root = new URL('../', import.meta.url);
const text = (relative) => readFileSync(new URL(relative, root), 'utf8');

test('historical exceptions are exact fingerprints only', () => {
  const entries = new Set(
    text('.gitleaksignore')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')),
  );

  assert.deepEqual(entries, expectedFingerprints);
  for (const entry of entries) {
    assert.match(entry, /^[0-9a-f]{40}:.+:generic-api-key:\d+$/);
  }
});

test('generated and prompt artifacts cannot be committed again', () => {
  const ignore = text('.gitignore');
  for (const pattern of [
    'ppllm.prompt.txt',
    'sharepoint/solution/debug/',
    'sharepoint/solution/*.sppkg',
  ]) {
    assert.ok(ignore.split(/\r?\n/).includes(pattern), pattern);
  }

  const tracked = execFileSync(
    'git',
    [
      'ls-files',
      'ppllm.prompt.txt',
      'sharepoint/solution/debug/**',
      'sharepoint/solution/*.sppkg',
    ],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(tracked, '');
});

test('security workflow is immutable and least privilege', () => {
  const workflow = text('.github/workflows/security.yml');
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.doesNotMatch(workflow, /pull_request_target/);
  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /persist-credentials: false/);

  const refs = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s#]+)/g)].map(
    ([, ref]) => ref,
  );
  assert.ok(refs.length >= 3);
  assert.ok(refs.every((ref) => /^[0-9a-f]{40}$/.test(ref)));

  for (const command of [
    'npm ci',
    'npm run test:security',
    'npm audit --omit=dev --audit-level=moderate',
    'npm run lint',
    'npm run build',
  ]) {
    assert.ok(workflow.includes(command), command);
  }

  assert.match(workflow, /gitleaks\/gitleaks-action@[0-9a-f]{40}/);
  assert.match(workflow, /GITHUB_TOKEN:\s+\$\{\{ github\.token \}\}/);
  assert.doesNotMatch(workflow, /run:[^\n]*\$\{\{\s*github\./);
});
