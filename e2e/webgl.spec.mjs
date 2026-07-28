import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const artifactDir = path.resolve('artifacts/e2e');
const fatalPattern = /(RuntimeError|abort\(|out of memory|wasm(?:32)?[^\n]*trap|uncaught|unhandled|exception)/i;

test('THJam13 WebGL boots, accepts existing controls, and leaves evidence', async ({ page }) => {
  const url = process.env.WEBGL_URL;
  expect(url, 'WEBGL_URL must point at the built Unity HTML file').toBeTruthy();

  fs.mkdirSync(artifactDir, { recursive: true });

  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  await expect.poll(async () => {
    return canvas.evaluate(element => element.width >= 640 && element.height >= 360);
  }, { message: 'Unity Canvas must have a usable backing resolution' }).toBe(true);

  // Give Unity/WASM time to finish startup without guessing application internals.
  await page.waitForTimeout(15_000);

  const bootShot = await page.screenshot({
    path: path.join(artifactDir, '01-webgl-boot.png'),
    fullPage: true
  });
  expect(bootShot.byteLength).toBeGreaterThan(10_000);

  // Only exercise controls already defined by the completed THJam13 game.
  await canvas.click({ force: true });
  await page.keyboard.press('Space');
  await page.keyboard.press('KeyZ');
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('KeyZ');
  await page.waitForTimeout(3_000);

  const inputShot = await page.screenshot({
    path: path.join(artifactDir, '02-webgl-after-input.png'),
    fullPage: true
  });
  expect(inputShot.byteLength).toBeGreaterThan(10_000);

  const dimensions = await canvas.evaluate(element => ({
    width: element.width,
    height: element.height,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight
  }));

  const fatalErrors = [...pageErrors, ...consoleErrors].filter(message => fatalPattern.test(message));
  const evidence = {
    url,
    capturedAt: new Date().toISOString(),
    dimensions,
    exercisedControls: ['Space', 'Z', 'Shift+Left', 'Shift+Right', 'Down', 'Z'],
    pageErrors,
    consoleErrors,
    fatalErrors
  };
  fs.writeFileSync(
    path.join(artifactDir, 'webgl-smoke.json'),
    `${JSON.stringify(evidence, null, 2)}\n`,
    'utf8'
  );

  await test.info().attach('webgl-smoke', {
    body: Buffer.from(JSON.stringify(evidence, null, 2)),
    contentType: 'application/json'
  });

  expect(fatalErrors, `Fatal browser/Unity errors:\n${fatalErrors.join('\n')}`).toEqual([]);
});
