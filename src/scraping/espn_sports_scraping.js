import { load } from "cheerio";
import { createOutputFile, fetchURL, sleep } from "../utils/kit.js";

async function espnSports() {
  console.log("run espn sorts scraping");
  const teams = [
    {
      teamName: "indianapolis colts",
      category: "nfl",
      geoLocation: "ind",
    },
    {
      teamName: "indiana pacers",
      category: "nba",
      geoLocation: "ind",
    },
    {
      teamName: "indiana fever",
      category: "wnba",
      geoLocation: "ind",
    },
  ];

  let espnArticleList = [];
  for (const [index, team] of teams.entries()) {
    console.log(`search data of ${team.teamName}`);
    sleep(1000);

    let url = `https://www.espn.com/${team.category}/team/_/name/${
      team.geoLocation
    }/${team.teamName.replaceAll(" ", "-")}`;

    // GET PAGE CONTENT
    let getPageContent = await fetchURL(url);
    //VARIABLES
    let getArticleUrlEspn,
      getArticleTitleEspn,
      getArticleImageEspn,
      getArticleImageAltNameEspn = "",
      getArticleDescriptionEspn = `news of ${team.teamName}`;

    //LOAD PAGE CONTENT
    const $ = load(getPageContent);
    //GET SCRIPT DATA
    let getScriptData = $("body script:not([src])")
      .html()
      .replace("window['__espnfitt__']=", "")
      .replace("};", "}");

    //CONVERT SCRIPT DATA TO ARRAY
    let convertDataToArray = JSON.parse(getScriptData);

    //GET ALL ARTICLES BY TEAMS
    let searchArticles =
      convertDataToArray.page.content.clubhouse.columns.middleColumn.clubhouse
        .feed;

    for (const [index, el] of searchArticles.entries()) {
      if (el.link != null) {
        //GET LINK
        getArticleUrlEspn = el.link;

        //GET TITLE
        getArticleTitleEspn = el.headline.replace("— ", "");

        //GET DESCRIPTION
        if (el.description != "") {
          getArticleDescriptionEspn = el.description.replace("— ", "");
        }

        // GET IMAGE
        if (el.image != null) {
          if (el.image.name != null) {
            getArticleImageAltNameEspn = el.image.name;
          }
          getArticleImageEspn = el.image.url;
        }

        // ADD ARTICLE TO ARRAY LIST
        espnArticleList.push({
          title: getArticleTitleEspn,
          description: getArticleDescriptionEspn,
          url: `https://www.espn.com${getArticleUrlEspn}`,
          altName: getArticleImageAltNameEspn,
          image: getArticleImageEspn,
          team: team.teamName.replaceAll(" ", "_"),
        });
      }
    }
  }

  // OUTPUT FILE
  await createOutputFile("espn_articles.json", espnArticleList);
  console.log("finish espn sports scraping");
  //process.exit(0);
}

export default espnSports;
