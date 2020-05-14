// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
const open = require("open");
const youtube = require("./youtube");
const SCREENSHOTS_PATH = "app";
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

(async () => {
  await youtube.initialize();
  await youtube.login(process.env.LOGIN, process.env.PASSWORD);
  await youtube.check(tracklist);
  await youtube.end();
  await open(SCREENSHOTS_PATH, { wait: true });
})();

// puppeteer
//   .launch({
//     args: [
//       "--no-sandbox",
//       "--headless",
//       "--disable-gpu",
//       "--window-size=1920x1080",
//     ],
//   })
//   .then(async (browser) => {
//     const tracklist = [
//       {
//         artist: "Loadstar",
//         title: "Once Again",
//       },
//       {
//         artist: "Milkyway",
//         title: "Fairy Tale",
//       },
//       {
//         artist: "Random Movement",
//         title: "Lake Escape",
//       },
//     ];
//     const page = await browser.newPage();
//     await page.goto("https://accounts.google.com/");

//     const fillEmail = async () => {
//       await page.waitForSelector('input[type="email"]');
//       await page.click('input[type="email"]');
//       await page.type('input[type="email"]', process.env.LOGIN, {
//         delay: 50,
//       });
//     };
//     const clickEmailNext = async () => {
//       await page.waitForSelector("#identifierNext");
//       await page.click("#identifierNext");
//       await page.waitFor(250);
//     };
//     const fillPassword = async () => {
//       await page.waitForSelector('input[type="password"]');
//       await page.evaluate(() => {
//         document.querySelector('input[type="password"]').click();
//       });
//       await page.waitFor(1000);
//       await page.type('input[type="password"]', process.env.PASSWORD, {
//         delay: 50,
//       });
//       await page.waitFor(250);
//     };
//     const clickPasswordNext = async () => {
//       await page.waitForSelector("#passwordNext");
//       await page.click("#passwordNext");
//       console.log("logged");
//       await page.waitFor(1000);
//     };

//     await fillEmail();
//     await clickEmailNext();
//     await fillPassword();
//     await clickPasswordNext();
//     await page.goto("https://www.youtube.com/music_policies?nv=1");
//     console.log("redirected");

//     for ([index, track] of tracklist.entries()) {
//       console.log(index, track);

//       await page.evaluate(() => {
//         document.querySelector('input[maxlength="80"]').click();
//       });

//       await page.waitFor(1000);
//       await page.type(
//         'input[maxlength="80"]',
//         `${tracklist[index].artist} - ${tracklist[index].title}`,
//         {
//           delay: 50,
//         }
//       );
//       console.log("typed");
//       await page.waitFor(3000);

//       await page.evaluate(() => {
//         document.querySelector(".search-icon").click();
//       });
//       console.log("clicked search icon");
//       //await page.waitFor(10000);

//       // search results
//       await page.waitForSelector(".track-list.sorting");
//       await page.waitFor(1000);
//       let resultsArray = await page.$$(".track-list > li");
//       let results = [];

//       // isBanned
//       // .track-content .asset-not-available-text

//       // isOk
//       // !(.track-content .asset-not-available-text)

//       // isMissing
//       // .track-content.no-results

//       // for infinite scroll
//       // let lastResultArrayLength = 0;
//       // while (resultsArray.length < count) {
//       //   await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
//       //   await page.waitFor(3000);

//       //   resultsArray = await page.$$(".track-list > li");

//       //   if (lastResultArrayLength === resultsArray.length) break;

//       //   lastResultArrayLength = resultsArray.length;
//       // }
//       console.log("Entering for loop");
//       for (let [resultIndex, resultElement] of resultsArray.entries()) {
//         let artist = await resultElement.$eval(
//           ".audiolibrary-column-artist",
//           (element) => element.innerText
//         );
//         let title = await resultElement.$eval(
//           ".audiolibrary-column-title",
//           (element) => element.innerText
//         );
//         console.log(`=========`);
//         console.log(`Elem : ${artist} - ${title}`);
//         console.log(`=========`);
//         console.log(
//           `Tracklist : ${tracklist[index].artist} - ${tracklist[index].title}`
//         );
//         console.log(`=========`);
//         if (
//           artist === tracklist[index].artist &&
//           title === tracklist[index].title
//         ) {
//           await page.evaluate((i) => {
//             let num = i + 1;
//             console.log(num);
//             document
//               .querySelector(
//                 `.track-list li:nth-child(${num}) .audiolibrary-track-head`
//               )
//               .click();
//           }, resultIndex);

//           console.log("clicked li");
//           await page.waitFor(1000);
//         }
//         results.push(title);
//       }

//       console.log(results);
//       await page.screenshot({
//         path: `testresult${index}.png`,
//         fullPage: true,
//       });
//       console.log("screenshoted");
//       await page.evaluate(() => {
//         document.querySelector('input[maxlength="80"]').value = "";
//       });
//       await page.waitFor(1000);
//     }

//     await browser.close();
//   });
