import fetch from "node-fetch";
import puppeteer from "puppeteer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

async function createOutputFile(filename, data, outputDir = "output") {
  let dirOutputRoute = path.join(__dirname, `../../${outputDir}`);
  let outputFile = path.join(__dirname, `../../${outputDir}/${filename}`);
  if (!fs.existsSync(dirOutputRoute)) {
    fs.mkdirSync(dirOutputRoute);
  }
  // IF FILE NOT EXTIS CREATE NEW OUPUT ELSE ADD MORE DATA IN THE FILE
  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, JSON.stringify(data), {
      encoding: "utf-8",
      flag: "w",
    });
  } else {
    let getFileData = fs.readFileSync(outputFile, {
        encoding: "utf-8",
        flag: "r",
    });
    //INCLUDE NEW DATA
    let createNewData = JSON.parse(getFileData);
    for (const [index, oldPost] of createNewData.entries()) {
        data.push(oldPost);
    }
    //WRITE AND OUTPUT DATA
    fs.writeFileSync(outputFile, JSON.stringify(data), {
        encoding: "utf-8",
        flag: "w",
    });
  }
}

async function fetchURL(URL) {
  let data = "";
  const response = await fetch(URL);
  data = response.text();
  return data;
}

async function createNewPage(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export { createOutputFile, fetchURL, createNewPage, sleep };
