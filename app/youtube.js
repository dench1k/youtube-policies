// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal

const BASE_URL = "https://www.youtube.com/music_policies?nv=1";
const LOGIN_URL = "https://accounts.google.com/";
const SCREENSHOTS_PATH = "app/screenshots";
let browser = null;
let page = null;

const youtube = {
  initialize: async () => {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    page = await browser.newPage();
  },

  fillEmail: async (email) => {
    const selectorEmail = 'input[type="email"]';
    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    youtube.log("BAAAm");
    await page.type('input[type="email"]', email, {
      delay: 50,
    });
  },

  clickEmailNext: async () => {
    const selectorButton = "#identifierNext";
    await page.waitForSelector(selectorButton);
    await page.click(selectorButton);
    await page.waitFor(250);
  },

  fillPassword: async (password) => {
    youtube.log("filled email, now pass");
    youtube.screenshot(`pass.png`);
    const selectorPassword = 'input[type="password"]';
    await page.waitForSelector(selectorPassword);
    await page.evaluate(() => {
      document.querySelector(selectorPassword).click();
    });
    await page.waitFor(1000);
    await page.type(selectorPassword, password, {
      delay: 50,
    });
    await page.waitFor(250);
  },

  clickPasswordNext: async () => {
    const selectorButton = "#passwordNext";
    await page.waitForSelector(selectorButton);
    await page.click(selectorButton);
    await page.waitFor(1000);
  },

  login: async (email, password) => {
    await page.goto(LOGIN_URL);

    await youtube.fillEmail(email);
    await youtube.clickEmailNext();
    await youtube.fillPassword(password);
    await youtube.clickPasswordNext();

    youtube.log("logged");

    await page.goto(BASE_URL);
    youtube.log("redirected");
  },

  check: async (tracklist) => {
    for ([index, track] of tracklist.entries()) {
      youtube.log(index, track);

      await page.evaluate(() => {
        document.querySelector('input[maxlength="80"]').click();
      });

      await page.waitFor(1000);
      await page.type(
        'input[maxlength="80"]',
        `${tracklist[index].artist} - ${tracklist[index].title}`,
        {
          delay: 50,
        }
      );
      youtube.log("typed");
      await page.waitFor(3000);

      await page.evaluate(() => {
        document.querySelector(".search-icon").click();
      });
      youtube.log("clicked search icon");

      // search results
      await page.waitForSelector(".track-list.sorting");
      await page.waitFor(1000);
      let resultsArray = await page.$$(".track-list > li");
      let results = [];

      // isBanned
      // .track-content .asset-not-available-text

      // isOk
      // !(.track-content .asset-not-available-text)

      // isMissing
      // .track-content.no-results

      for (let [resultIndex, resultElement] of resultsArray.entries()) {
        let artist = await resultElement.$eval(
          ".audiolibrary-column-artist",
          (element) => element.innerText
        );
        let title = await resultElement.$eval(
          ".audiolibrary-column-title",
          (element) => element.innerText
        );
        youtube.log(`=========`, "warning");
        youtube.log(`Elem : ${artist} - ${title}`);
        youtube.log(`=========`, "warning");
        youtube.log(
          `Tracklist : ${tracklist[index].artist} - ${tracklist[index].title}`
        );
        youtube.log(`=========`, "warning");
        if (
          artist === tracklist[index].artist &&
          title === tracklist[index].title
        ) {
          await page.evaluate((i) => {
            let num = i + 1;
            youtube.log(num, "warning");
            document
              .querySelector(
                `.track-list li:nth-child(${num}) .audiolibrary-track-head`
              )
              .click();
          }, resultIndex);

          youtube.log("clicked li");
          await page.waitFor(1000);
        }
        results.push(title);
      }

      console.log(results);
      const timestamp = Date.now();
      youtube.screenshot(
        `${index}_${tracklist[index].artist}_${tracklist[index].title}_${timestamp}.png`
      );

      await page.evaluate(() => {
        document.querySelector('input[maxlength="80"]').value = "";
      });
      await page.waitFor(1000);
    }
  },

  screenshot: async (filename) => {
    await page.screenshot({
      path: `${SCREENSHOTS_PATH}/${filename}`,
      fullPage: true,
    });
    youtube.log("screenshoted");
  },
  log: (message, type) => {
    if (type === "error") {
      console.log(chalk.red(message));
    } else if (type === "warning") {
      console.log(chalk.yellow(message));
    } else {
      console.log(chalk.green(message));
    }
  },
  end: async () => {
    await browser.close();
  },
};
// for infinite scroll
// let lastResultArrayLength = 0;
// while (resultsArray.length < count) {
//   await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
//   await page.waitFor(3000);

//   resultsArray = await page.$$(".track-list > li");

//   if (lastResultArrayLength === resultsArray.length) break;

//   lastResultArrayLength = resultsArray.length;
// }
module.exports = youtube;
