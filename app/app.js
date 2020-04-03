const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   slowMo: 250, // slow down by 250ms
  // });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto(
    "https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dru%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=ru&ec=65620"
  );

  const h1 = await page.evaluate(
    () => document.querySelector("h2").textContent
  );
  const link = await page.$("input[type=email]");
  const text = await (await link.getProperty("id")).jsonValue();

  console.log(h1);
  console.log(text);

  await browser.close();
})();
