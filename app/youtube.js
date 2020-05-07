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
  },

  end: async () => {
    await browser.close();
  },
};

module.exports = twitter;
