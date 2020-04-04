const puppeteer = require("puppeteer");

(async () => {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250, // slow down by 250ms
  });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto("https://accounts.google.com/");

  await navigationPromise;

  await page.waitForSelector('input[type="email"]');
  await page.click('input[type="email"]');

  await navigationPromise;

  //TODO : change to your email
  await page.type('input[type="email"]', "login@gmail.com");
  await page.waitForSelector("#identifierNext");
  await page.click("#identifierNext");

  await page.waitFor(500);

  await page.waitForSelector('input[type="password"]');
  await page.click('input[type="email"]');
  await page.waitFor(500);
  //TODO : change to your password
  await page.type('input[type="password"]', "password");

  await page.waitForSelector("#passwordNext");
  await page.click("#passwordNext");

  await navigationPromise;

  // const h1 = await page.evaluate(
  //   () => document.querySelector("h2").textContent
  // );
  //const link = await page.$("input[type=email]");
  //const text = await (await link.getProperty("id")).jsonValue();

  //console.log(h1);
  //console.log(text);

  await browser.close();
})();
