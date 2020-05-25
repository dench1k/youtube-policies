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
    artist: "Deadmau5",
    title: "Avaritia (Dimension Remix)",
  },
  {
    artist: "Mojoman",
    title: "Because Of Us",
  },
  {
    artist: "Maduk",
    title: "The End",
  },
  {
    artist: "Alex Adair",
    title: "Make Me Feel Better (S.P.Y Remix)",
  },
  {
    artist: "Motiv",
    title: "Viaduct",
  },
  {
    artist: "Silence Groove",
    title: "Evergreen 2006",
  },
  {
    artist: "ALB",
    title: "Evolver",
  },
  {
    artist: "Netsky",
    title: "Come Back Home",
  },
  {
    artist: "Pola & Bryson",
    title: "Call Of The Night",
  },
  {
    artist: "Pulsate",
    title: "Cold Souls",
  },
  {
    artist: "Phaction",
    title: "Someone",
  },
  {
    artist: "Bcee",
    title: "Firebox",
  },
  {
    artist: "Au/Ra",
    title: "Panic Room (Culture Shock Remix)",
  },
  {
    artist: "Emperor",
    title: "Foxholes",
  },
  {
    artist: "Knife Party",
    title: "LRAD (The Prototypes Remix)",
  },
  {
    artist: "High Contrast",
    title: "If We Ever",
  },
  {
    artist: "Bert H",
    title: "Old Days Were Better",
  },
  {
    artist: "Petroll",
    title: "Leaf",
  },
  {
    artist: "Makoto",
    title: "Mystic Crystals",
  },
  {
    artist: "Kin:etic",
    title: "Blue Grey",
  },
  {
    artist: "Kill Paris",
    title: "Silence Of Heartbreak (Random Movement Remix)",
  },
  {
    artist: "Intelligent Manners",
    title: "All By Myself",
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
