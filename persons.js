import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = "http://inmateinfo.indy.gov/IML";
const user = {
  firstName: "",
  lastName: "",
};

const actionsEvents = {
  getUsers: "//a[@class='underlined']",
  nextButton: "[class='generalnav']",
};

async function getData() {
  //PREPARE AND LOAD BROWER
  let searchData = true;
  const browser = await puppeteer.launch({
    slowMo: 100,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  /*---------------------- */
  //EVETNS AND ACTIONS IN THE SITE

  //SEARCH BY FIRST_NAME
  await page.type(
    "input[name=systemUser_firstName]",
    user.firstName.toUpperCase()
  );

  //SEARCH BY LAST_NAME
  await page.type(
    "input[name=systemUser_lastName]",
    user.lastName.toUpperCase()
  );

  //SUCCESS FORM
  await page.keyboard.press("Enter");

  //CHANGE PAGE
  async function nextPage() {
    let searchListButton = await page.$$("div > a.generalnav");
    let indexByNextPage = null;
    //SEARCH MEXT BUTTON
    for (let index = 0; index < searchListButton.length; index++) {
      const getButton = searchListButton[index];
      const getTextContentHref = await (
        await getButton.getProperty("innerText")
      ).jsonValue();
      if (getTextContentHref === "Next>") {
        indexByNextPage = index;
      }
    }
    //CLICK EVENT NEXT PAGE
    if (indexByNextPage != null) {
      await searchListButton[indexByNextPage].click();
      return true;
    }
    return false;
  }
  //NAVAGATE POR PROFILE PERSON AND ACCESS TO INFORMATION
  let prepararePersonsData = [];
  let countIndex = 0;
  async function serachPerson() {
    let arrayNamePersons = [];
    await page.waitForXPath(actionsEvents.getUsers);
    //GET GENERAL TABLE OF PERSONS
    let searchTablePersons = await page.$$(
      "body > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody"
    );
    //GET ROW OF TABLE
    let getTablePersons = await searchTablePersons[1].$$("tbody > tr");
    for (const getPerson of getTablePersons) {
      let getFeaturesPerson = await getPerson.$$("a");
      let getNamePerson = await (
        await getFeaturesPerson[0].getProperty("innerText")
      ).jsonValue();
      let getBookNumber = await (
        await getFeaturesPerson[1].getProperty("innerText")
      ).jsonValue();
      let getPermantID = await (
        await getFeaturesPerson[2].getProperty("innerText")
      ).jsonValue();
      let getDateBirth = await (
        await getFeaturesPerson[3].getProperty("innerText")
      ).jsonValue();

      console.log("-----------------");
      console.log(getNamePerson);
      console.log(getBookNumber);
      console.log(getPermantID);
      console.log(getDateBirth);
      console.log("-----------------");

      arrayNamePersons.push({
        name: getNamePerson,
        bookID: getBookNumber,
        permantID: getPermantID,
        birthDay: getDateBirth,
      });
    }
    prepararePersonsData.push({
      nList: countIndex,
      persons: arrayNamePersons,
    });
    countIndex++;

    //LOOP FOR OBTAIN DATA
    if (searchData == true) {
      nextPage().then(async (status) => {
        console.log("---------------------------");
        console.log("Mora data staus: " + status);
        console.log("---------------------------");
        status = false
        if (status != true) {
          searchData = false;
          let getRootFile = path.resolve(process.cwd(), "../");
          console.log(getRootFile)
          if (
            !fs.existsSync(
              path.join(getRootFile, "/assets/json/output_inmates")
            )
          ) {
            fs.mkdirSync(
              path.join(getRootFile, "/assets/json/output_inmates"),
              {
                recursive: true,
              }
            );
          }
          fs.writeFileSync(
            path.join(getRootFile, "/assets/json/output_inmates") +
              "/dataPersons.json",
            JSON.stringify(prepararePersonsData),
            { encoding: "utf-8", flag: "w", mode: 0o666 }
          );
          await browser.close();
          process.exit(1);
        }
        serachPerson();
      });
    }
  }

  // CALL FUNCTION
  serachPerson();
}

//setInterval(() => {
  getData();
//}, 28800000);
