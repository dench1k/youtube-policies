// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

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
    await page.waitForSelector(selectorEmail);
    await page.click(selectorEmail);
    await page.type(selectorEmail, email, {
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
    const selectorPassword = 'input[type="password"]';
    await page.waitForSelector('input[type="password"]');
    await page.evaluate(() => {
      document.querySelector('input[type="password"]').click();
    });
    await page.waitFor(1000);
    await page.type('input[type="password"]', password, {
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

    youtube.log("Logged");

    await page.goto(BASE_URL);
    youtube.log(`Redirected to ${BASE_URL}`);
  },

  check: async (tracklist) => {
    for ([index, track] of tracklist.entries()) {
      youtube.log(`${index}: ${track.artist} - ${track.title}`, "warning");

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
      await page.waitFor(3000);
      await page.evaluate(() => {
        document.querySelector(".search-icon").click();
      });

      // search results
      await page.waitForSelector(".track-list.sorting");
      await page.waitFor(1000);
      let resultsArray = await page.$$(".track-list > li");

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
        youtube.log(`---`, "warning");
        youtube.log(`Current track: ${artist} - ${title}`);
        youtube.log(
          `Tracklist: ${tracklist[index].artist} - ${tracklist[index].title}`
        );
        youtube.log(`---`, "warning");
        if (
          artist === tracklist[index].artist &&
          title === tracklist[index].title
        ) {
          await page.evaluate((i) => {
            let num = i + 1;
            document
              .querySelector(
                `.track-list li:nth-child(${num}) .audiolibrary-track-head`
              )
              .click();
          }, resultIndex);
          youtube.log(" ");
          youtube.log(`Match! Clicked ${resultIndex + 1} result`);
          youtube.log(" ");
          await page.waitFor(1000);
        }
      }

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
    youtube.log(" ");
    youtube.log("Screenshot was taken");
    youtube.log(" ");
  },
  removeFromDir: async (directory) => {
    try {
      const files = await readdir(directory);
      const unlinkPromises = files.map((filename) =>
        unlink(`${directory}/${filename}`)
      );
      return Promise.all(unlinkPromises);
    } catch (err) {
      console.log(err);
    }
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
