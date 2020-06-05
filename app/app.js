// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
const open = require("open");
const youtube = require("./youtube");
const SCREENSHOTS_PATH = `${__dirname}/screenshots`;
const tracklist = [
  {
    artist: "Karma Kingdom",
    title: "Pleasures (Hazqa Remix)",
  },
  {
    artist: "Deadmau5",
    title: "Avaritia (Dimension Remix)",
  },

  {
    artist: "Netsky",
    title: "Come Back Home",
  },
  {
    artist: "Pola & Bryson",
    title: "Call Of The Night",
  },
];

(async () => {
  await youtube.initialize();
  await youtube.login(process.env.LOGIN, process.env.PASSWORD);
  await youtube.removeFromDir(SCREENSHOTS_PATH);
  await youtube.check(tracklist);
  await youtube.end();
  await open(SCREENSHOTS_PATH, { wait: true });
})();
