import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    await page.screenshot({ path: 'screenshot.jpg' });
    console.log('SCREENSHOT TAKEN: screenshot.jpg');

    await browser.close();
})();
