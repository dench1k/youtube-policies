// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal

const BASE_URL = "https://www.youtube.com/music_policies?nv=1";
const LOGIN_URL = "https://accounts.google.com/";
const tracklist = [
  {
    artist: "Loadstar",
    title: "Once Again",
  },
  {
    artist: "Milkyway",
    title: "Fairy Tale",
  },
  {
    artist: "Random Movement",
    title: "Lake Escape",
  },
];

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
    await fillEmail(email);
    await clickEmailNext();
    await fillPassword(password);
    await clickPasswordNext();
    console.log("logged");
    await page.goto(BASE_URL);
    console.log("redirected");
  },
  check: async () => {
    for ([index, track] of tracklist.entries()) {
      console.log(index, track);

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
      console.log("typed");
      await page.waitFor(3000);

      await page.evaluate(() => {
        document.querySelector(".search-icon").click();
      });
      console.log("clicked search icon");
      //await page.waitFor(10000);

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

      // for infinite scroll
      // let lastResultArrayLength = 0;
      // while (resultsArray.length < count) {
      //   await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
      //   await page.waitFor(3000);

      //   resultsArray = await page.$$(".track-list > li");

      //   if (lastResultArrayLength === resultsArray.length) break;

      //   lastResultArrayLength = resultsArray.length;
      // }
      console.log("Entering for loop");
      for (let [resultIndex, resultElement] of resultsArray.entries()) {
        let artist = await resultElement.$eval(
          ".audiolibrary-column-artist",
          (element) => element.innerText
        );
        let title = await resultElement.$eval(
          ".audiolibrary-column-title",
          (element) => element.innerText
        );
        console.log(`=========`);
        console.log(`Elem : ${artist} - ${title}`);
        console.log(`=========`);
        console.log(
          `Tracklist : ${tracklist[index].artist} - ${tracklist[index].title}`
        );
        console.log(`=========`);
        if (
          artist === tracklist[index].artist &&
          title === tracklist[index].title
        ) {
          await page.evaluate((i) => {
            let num = i + 1;
            console.log(num);
            document
              .querySelector(
                `.track-list li:nth-child(${num}) .audiolibrary-track-head`
              )
              .click();
          }, resultIndex);

          console.log("clicked li");
          await page.waitFor(1000);
        }
        results.push(title);
      }

      console.log(results);
      await page.screenshot({
        path: `testresult${index}.png`,
        fullPage: true,
      });
      console.log("screenshoted");
      await page.evaluate(() => {
        document.querySelector('input[maxlength="80"]').value = "";
      });
      await page.waitFor(1000);
    }
  },
  end: async () => {
    await browser.close();
  },
};

module.exports = youtube;
