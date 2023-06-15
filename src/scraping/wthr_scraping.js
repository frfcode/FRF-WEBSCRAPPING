import { load } from "cheerio";
import { fetchURL, createOutputFile } from "../utils/kit.js";

async function wthr() {
  console.log("run wthr scraping");
  try {
    const url = `https://www.wthr.com/local`;

    //GET CONTENT OF URL
    const getUrlContent = await fetchURL(url);

    //LOAD DATA OF DOCUMENT INDEX.HTML
    const $ = await load(getUrlContent);
    let objPost = [];
    $(
      "div.grid__main .grid__cell_columns_1 .grid__module .grid__module-sizer_name_headline-list .headline-list ul li"
    ).each(async (index, el) => {
      //GET ACTUALLY POST URL
      let getPostHref = await $(el).find("a").attr("href");

      // GET POST CONTENT BY URL
      let getPostContent = await fetchURL(getPostHref);

      //LOAD NEW CONTENT OF NEW POST URL
      const $_CONTENT_POST = await load(getPostContent);

      //VARIABLE OF SEARCH'S
      let getPostTitle,
        getPostExtract,
        getPostImage,
        getPostDescription,
        getPostVideo;

      //GET ACTUALLY POST TITLE
      getPostTitle = await $_CONTENT_POST("h1.article__headline").text();

      //GET ACTUALLY POST DESCRIPTION
      getPostDescription = await $_CONTENT_POST(
        'meta[property="og:description"]'
      ).attr("content");

      //GET ACTUALLY POST IMAGE OR THUMBNAIL
      getPostImage = await $_CONTENT_POST('meta[property="og:image"]').attr(
        "content"
      );

      //GET ACTUALLY POST CONTENT
      getPostExtract = await $_CONTENT_POST("div.article__body p").text();

      //GET ACTUALLY VIDEO POST CONTENT
      if (
        (await $_CONTENT_POST(
          'div.video script[type="application/ld+json"]'
        ).text()) != null
      ) {
        getPostVideo = JSON.parse(
          await $_CONTENT_POST('div.video script[type="application/ld+json"]')
            .text()
            .replaceAll("\n", "")
        )["embedUrl"];
      }

      //CREATE OBJ AND SAVE DATA
      objPost.push({
        post_url: getPostHref,
        post_image: getPostImage,
        post_title: getPostTitle,
        post_description: getPostDescription,
        post_date: new Date().toLocaleDateString("en-US"),
        post_content: getPostExtract,
        post_video: getPostVideo,
      });

      await createOutputFile("wthr_posts.json", objPost);
    });
    console.log("wthr scraping finalizado");
  } catch (error) {
    console.log("error al ejecutar script \n" + error);
  }
}

export default wthr;
