// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal

puppeteer
  .launch({
    args: [
      "--no-sandbox",
      "--headless",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto("https://accounts.google.com/");

    const fillEmail = async () => {
      await page.waitForSelector('input[type="email"]');
      await page.click('input[type="email"]');
      await page.type('input[type="email"]', process.env.LOGIN, { delay: 50 });
    };
    const clickEmailNext = async () => {
      await page.waitForSelector("#identifierNext");
      await page.click("#identifierNext");
      await page.waitFor(500);
    };
    const fillPassword = async () => {
      await page.waitForSelector('input[type="password"]');
      await page.evaluate(() => {
        document.querySelector('input[type="password"]').click();
      });
      await page.waitFor(2500);
      await page.type('input[type="password"]', process.env.PASSWORD, {
        delay: 50,
      });
      await page.waitFor(500);
    };
    const clickPasswordNext = async () => {
      await page.waitForSelector("#passwordNext");
      await page.click("#passwordNext");
      console.log("logged");
      await page.waitFor(2500);
    };

    await fillEmail();
    await clickEmailNext();
    await fillPassword();
    await clickPasswordNext();
    await page.goto("https://www.youtube.com/music_policies?nv=1");
    console.log("redirected");

    let url = await page.url();
    console.log(url);
    await page.evaluate(() => {
      document.querySelector('input[maxlength="80"]').click();
    });

    console.log("clicked");
    await page.waitFor(2500);

    await page.type('input[maxlength="80"]', "Netsky - Come Alive", {
      delay: 50,
    });
    console.log("typed");
    await page.waitFor(2500);

    await page.evaluate(() => {
      document.querySelector(".search-icon").click();
    });
    console.log("clicked icon");
    await page.waitFor(10000);

    // search results
    await page.waitFor(".track-list");
    let resultsArray = await page.$$(".track-list > li");
    let results = [];

    for (let resultElement of resultsArray) {
      let title = await resultElement.$eval(
        ".audiolibrary-column-title",
        (element) => element.innerText
      );
      results.push(title);
    }

    console.log(results);

    await page.evaluate(() => {
      document
        .querySelector(".track-list li:nth-child(2) .audiolibrary-track-head")
        .click();
    });

    console.log("clicked li");
    await page.waitFor(2500);

    await page.screenshot({ path: "testresult.png", fullPage: true });
    console.log("screenshoted");
    await page.waitFor(2500);

    await browser.close();
  });
