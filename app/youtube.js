// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal

const BASE_URL = "https://www.youtube.com/music_policies?nv=1";
const LOGIN_URL = "https://accounts.google.com/";

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
    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    await page.type('input[type="email"]', email, {
      delay: 50,
    });
  },
  clickEmailNext: async () => {
    await page.waitForSelector("#identifierNext");
    await page.click("#identifierNext");
    await page.waitFor(250);
  },
  fillPassword: async (password) => {
    await page.waitForSelector('input[type="password"]');
    await page.evaluate(() => {
      document.querySelector('input[type="password"]').click();
    });
    await page.waitFor(1000);
    await page.type('input[type="password"]', process.env.PASSWORD, {
      delay: 50,
    });
    await page.waitFor(250);
  },
  clickPasswordNext: async () => {
    await page.waitForSelector("#passwordNext");
    await page.click("#passwordNext");
    await page.waitFor(1000);
  },
  login: async (email, password) => {
    await page.goto(LOGIN_URL);
    await fillEmail(email);
    await clickEmailNext();
    await fillPassword(password);
    await clickPasswordNext();
    console.log("logged");
  },

  end: async () => {
    await browser.close();
  },
};

module.exports = twitter;
