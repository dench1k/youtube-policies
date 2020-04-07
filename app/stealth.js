// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer.launch({ headless: false, slowMo: 150 }).then(async (browser) => {
  const page = await browser.newPage();
  await page.goto("https://accounts.google.com/");

  await page.waitForSelector('input[type="email"]');
  await page.click('input[type="email"]');
  await page.type('input[type="email"]', "login@gmail.com");

  await page.waitForSelector("#identifierNext");
  await page.click("#identifierNext");
  await page.waitFor(500);

  await page.waitForSelector('input[type="password"]');
  await page.click('input[type="password"]');
  await page.waitFor(500);
  await page.type('input[type="password"]', "pass");

  await page.waitForSelector("#passwordNext");
  await page.click("#passwordNext");

  //await page.goto("https://www.youtube.com/music_policies?nv=1");
  //await page.screenshot({ path: "testresult.png", fullPage: true });
  //   await page.waitForSelector('input[type="text"]');
  //   await page.click('input[type="text"]');
  //   await page.waitFor(500);
  //   await page.type('input[type="text"]', "Dustkey - Your Letter");

  //   await page.goto("https://bot.sannysoft.com");
  //   await page.waitFor(5000);
  //   await page.screenshot({ path: "testresult.png", fullPage: true });
  await browser.close();
  //   console.log(`All done, check the screenshot. ✨`);
});
