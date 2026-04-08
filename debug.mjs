import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('http://localhost:5173', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 2000));

    const styles = await page.evaluate(() => {
        const root = document.getElementById('root');
        const firstChild = root.firstElementChild;
        const computed = window.getComputedStyle(firstChild);
        return {
            opacity: computed.opacity,
            display: computed.display,
            visibility: computed.visibility,
            transform: computed.transform
        };
    });

    console.log('COMPUTED STYLES:', styles);
    await browser.close();
})();
