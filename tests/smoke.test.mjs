// End-to-end checks against the real page. Run with `npm test`.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const site = fileURLToPath(new URL('../site/', import.meta.url));
const pageUrl = pathToFileURL(site + 'index.html').href;
let browser, page, errors;

before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

async function fresh() {
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 860 }, acceptDownloads: true });
  // Use the download path for Save: the save-in-place picker can't be answered in a headless browser.
  await ctx.addInitScript(() => { delete window.showSaveFilePicker; });
  page = await ctx.newPage();
  errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pageUrl);
  return page;
}
const modelIssues = () => page.textContent('#model-count');

test('opens empty, on the list of maps', async () => {
  await fresh();
  assert.ok(await page.isVisible('#start'));
  assert.ok(await page.isHidden('#work'));
  assert.deepEqual(errors, []);
});

test('the example opens with a clean model check', async () => {
  await fresh();
  await page.click('[data-start="example"]');
  assert.equal(await modelIssues(), '');
  assert.ok(await page.locator('[data-node="api"]').count() > 0);
  assert.deepEqual(errors, []);
});

test('searching ADR lists every decision in natural order', async () => {
  await fresh();
  await page.click('[data-start="example"]');
  await page.click('#map', { position: { x: 30, y: 600 } });
  await page.keyboard.press('Control+f');
  await page.keyboard.type('ADR');
  const ids = await page.$$eval('.fr[data-adr]', els => els.map(e => e.dataset.adr));
  assert.deepEqual(ids, [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));
  assert.ok(ids.length >= 6);
});

test('Save downloads the map as one file with model and layout', async () => {
  await fresh();
  await page.click('[data-start="example"]');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#save-file')]);
  assert.equal(download.suggestedFilename(), 'todo-app.wayfinder.json');
  const file = JSON.parse(readFileSync(await download.path(), 'utf8'));
  assert.equal(file.format, 'wayfinder');
  assert.ok(file.model.id.startsWith('map-'));
  assert.ok(Object.keys(file.layout).length > 0);
});

test('undo restores a moved component', async () => {
  await fresh();
  await page.click('[data-start="example"]');
  const pos = () => page.evaluate(() => {
    const ix = JSON.parse(localStorage.getItem('wayfinder.maps.v2'));
    return JSON.parse(localStorage.getItem('wayfinder.v2.map.' + ix[0].id)).layout.db.join(',');
  });
  const start = await pos();
  const box = await page.locator('[data-node="db"]').boundingBox();
  await page.mouse.move(box.x + 60, box.y + 50); await page.mouse.down();
  await page.mouse.move(box.x + 60, box.y + 140, { steps: 5 }); await page.mouse.up();
  assert.notEqual(await pos(), start);
  await page.keyboard.press('Control+z');
  assert.equal(await pos(), start);
});

test('the example in llms.txt imports with a clean model check', async () => {
  // Keeps the agent guide honest: its own example must be a valid map.
  const guide = readFileSync(site + 'llms.txt', 'utf8');
  const json = guide.match(/```json\n([\s\S]*?)```/)[1];
  await fresh();
  await page.setInputFiles('#start-file', { name: 'model.json', mimeType: 'application/json', buffer: Buffer.from(json) });
  await page.waitForSelector('#work:not([hidden])');
  assert.equal(await modelIssues(), '');
  assert.deepEqual(errors, []);
});
