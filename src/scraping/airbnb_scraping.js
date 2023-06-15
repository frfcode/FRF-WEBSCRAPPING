import { createOutputFile, createNewPage } from "../utils/kit.js";

async function airbnb() {
  console.log("run airbnb scraping");
  async function searchAirbnb(page, arrayAirbnb, numberPage) {
    //SHOW NUMBER PAGE OF INDEED
    console.log(`search data of page airbnb ${numberPage}`);

    //VARIABLES
    let airbnbTitle, airbnbPrice, airbnbUrl, airbnbDescription, airbnbImage;
    let classMasterBySearch = ".c4mnd7m";

    //SEARCH ALL AIRBNB'S
    await page.waitForSelector(classMasterBySearch);
    let getAirbnbList = await page.$$(classMasterBySearch);
    for (const [index, el] of getAirbnbList.entries()) {
      //GET AIRBNB URL
      airbnbUrl = await (
        await (await el.$("a")).getProperty("href")
      ).jsonValue();

      //FRAGMENT DIV'S FOR TITLE, IMAGE, DESCRIPTION, PRICE
      let fragmentTextCard = await el.$$("div.g1qv1ctd div");

      //GET AIRBNB TITLE
      airbnbTitle = await (
        await (await fragmentTextCard[0]).getProperty("innerText")
      ).jsonValue();

      //GET AIRBNB DESCRIPTION
      airbnbDescription = await (
        await (await fragmentTextCard[1]).getProperty("innerText")
      ).jsonValue();

      //GET AIRBNB PRICE
      airbnbPrice = await (
        await (await fragmentTextCard[7]).getProperty("innerText")
      ).jsonValue();

      //GET AIRBNB IMAGE
      airbnbImage = await (
        await (await el.$(".i1cqnm0r")).getProperty("src")
      ).jsonValue();

      //PREPARE OBJECT
      let objAirbnb = {
        airbnb_url: airbnbUrl,
        airbnb_title: airbnbTitle,
        airbnb_description: airbnbDescription.trim(),
        airbnb_price: airbnbPrice.replaceAll("\n", ""),
        airbnb_image: airbnbImage,
      };
      //PUSH DATA IN ARRAY jobsList
      arrayAirbnb.push(objAirbnb);
    }

    //RETURN VALUES OF ARRAY
    return arrayAirbnb;
  }

  //VARIABLES OF CONFIGURATION
  const geoLocation = "Indianapolis";
  const numberPages = 3;
  let pageCount = 1;

  //ARRAY OF OUTPUT DATA
  let airbnbList = [];

  //SEARCH DATA BY PAGE IN 10 AND 10
  while (pageCount <= numberPages) {
    let url = `https://www.airbnb.com/s/${geoLocation}/homes?&pagination_search=true&items_offset=${
      pageCount * 10
    }`;
    let pageInit = await createNewPage(url);
    await searchAirbnb(pageInit, airbnbList, pageCount);
    pageCount++;
  }
  //output file
  await createOutputFile("airbnb_scrap.json", airbnbList);

  console.log("finish airbnb scraping");
  //process.exit(0);
}

export default airbnb;
