/**
 * Playwright script to measure and help align reels perfectly centered on iPad.
 *
 * Usage (after starting the dev server):
 *   npm run align:ipad
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    // Common iPad portrait size used in the project
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5182/?final=1 in iPad portrait mode (baked styles only)...');
  await page.goto('http://localhost:5182/?final=1', { 
    waitUntil: 'domcontentloaded',
    timeout: 45000 
  });

  // Try to wait for key elements, but don't fail hard
  try {
    await page.waitForSelector('.reels-container', { timeout: 10000 });
  } catch (e) {
    console.log('Warning: .reels-container not found quickly, taking screenshot anyway...');
  }
  await page.waitForTimeout(2000);

  let reelsContainer, reels, reelFrame;
  try {
    reelsContainer = await page.locator('.reels-container').boundingBox();
    reels = await page.locator('.reels').boundingBox();
    reelFrame = await page.locator('#reel-frame-ov').boundingBox();
  } catch (e) {
    console.log('Warning: Could not get all bounding boxes. Taking screenshot of current state...');
  }

  if (!reelsContainer || !reels || !reelFrame) {
    console.log('Partial load detected. Screenshot will still be saved for visual reference.');
  }

  const reelsCx = reelsContainer.x + reelsContainer.width / 2;
  const reelsCy = reelsContainer.y + reelsContainer.height / 2;

  const frameCx = reelFrame.x + reelFrame.width / 2;
  const frameCy = reelFrame.y + reelFrame.height / 2;

  const reelsElementCx = reels.x + reels.width / 2;
  const reelsElementCy = reels.y + reels.height / 2;

  console.log('\n=== iPad Portrait Alignment Report ===');
  console.log(`Viewport: 768x1024 (iPad portrait)`);
  console.log(`Reels Container: x=${reelsContainer.x.toFixed(1)}, y=${reelsContainer.y.toFixed(1)}, w=${reelsContainer.width.toFixed(1)}, h=${reelsContainer.height.toFixed(1)}`);
  console.log(`Reels (inner):   x=${reels.x.toFixed(1)}, y=${reels.y.toFixed(1)}, w=${reels.width.toFixed(1)}, h=${reels.height.toFixed(1)}`);
  console.log(`Reel Frame:      x=${reelFrame.x.toFixed(1)}, y=${reelFrame.y.toFixed(1)}, w=${reelFrame.width.toFixed(1)}, h=${reelFrame.height.toFixed(1)}`);

  console.log(`\nCenters:`);
  console.log(`  Reels Container center: (${reelsCx.toFixed(1)}, ${reelsCy.toFixed(1)})`);
  console.log(`  Inner Reels center:     (${reelsElementCx.toFixed(1)}, ${reelsElementCy.toFixed(1)})`);
  console.log(`  Reel Frame center:      (${frameCx.toFixed(1)}, ${frameCy.toFixed(1)})`);

  const dx = frameCx - reelsCx;
  const dy = frameCy - reelsCy;

  console.log(`\nOffset (Frame center - Reels Container center): dx=${dx.toFixed(1)}px, dy=${dy.toFixed(1)}px`);

  if (Math.abs(dx) < 4 && Math.abs(dy) < 4) {
    console.log('✅ Reels look very well centered under the frame!');
  } else {
    console.log(`⚠️  The frame is offset. We can adjust the translate on #reel-frame-ov or the reel positions.`);
  }

  await page.screenshot({
    path: 'screenshots/ipad-reels-alignment.png',
    fullPage: false,
  });
  try {
    await page.screenshot({
      path: 'screenshots/ipad-reels-alignment.png',
      fullPage: false,
    });
    console.log('\nScreenshot saved → screenshots/ipad-reels-alignment.png');
  } catch (e) {
    console.log('Could not save screenshot, but continuing...');
  }

  await browser.close();
})();