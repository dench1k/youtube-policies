// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal

puppeteer
  .launch({
    headless: false,
    slowMo: 250, // slow down by 250ms
  })
  .then(async (browser) => {
    const page = await browser.newPage();

    await page.goto("https://accounts.google.com/");

    const fillEmail = () => {
      await page.waitForSelector('input[type="email"]');
      await page.click('input[type="email"]');
      await page.type('input[type="email"]', process.env.LOGIN);
    };
    
    const clickIdentifierNext = () => {
      await page.waitForSelector("#identifierNext");
      await page.click("#identifierNext");
      await page.waitFor(500);
    }

    fillEmail();
    clickIdentifierNext();

    await page.waitForSelector('input[type="password"]');
    await page.evaluate(() => {
      document.querySelector('input[type="password"]').click();
    });
    await page.waitFor(2500);
    await page.type('input[type="password"]', process.env.PASSWORD);

    await page.waitFor(500);
    await page.waitForSelector("#passwordNext");
    await page.click("#passwordNext");
    console.log("logged");
    await page.waitFor(2500);

    await page.goto("https://www.youtube.com/music_policies?nv=1");
    console.log("redirected");
    await page.waitFor(5000);

    await page.evaluate(() => {
      document.querySelector('input[maxlength="80"]').click();
    });
    console.log("clicked");
    await page.waitFor(2500);
    await page.type('input[maxlength="80"]', "Dustkey - Your Letter");
    await page.waitFor(2500);
    await page.evaluate(() => {
      document.querySelector('input[maxlength="80"]').click();
    });
    await page.waitFor(2500);
    await page.evaluate(() => {
      document.querySelector(".search-icon").click();
    });

    await page.waitFor(5000);
    await page.screenshot({ path: "testresult.png", fullPage: true });
    console.log("screenshoted");

    await browser.close();
  });
