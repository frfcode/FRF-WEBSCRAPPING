import { createOutputFile, createNewPage, sleep } from "../utils/kit.js";

async function googleEvents() {
  console.log("run google events scraping");
  //CONFIG FOR THE SEARCHS
  const site = ["events", "indianapolis"];
  const url = `https://www.google.com/search?q=${site.join("+")}&oq=events`;
  let page = await createNewPage(url);

  //VARIABLES
  let eventsTitle,
    eventsSite,
    eventsUrl,
    eventDate,
    eventsTime,
    eventList = [];

  //SLEEP FOR LOAD THE GOOGLE PAGE
  await sleep(2000);

  //SEARCH ALL EVENTS IN GOOGLE
  let getEvents = await page.$$(".klitem");

  for (const [index, el] of getEvents.entries()) {
    //GET TITLE
    eventsTitle = await (
      await (await el.$(".bVj5Zb")).getProperty("innerText")
    ).jsonValue();
    //GET SITE
    eventsSite = await (
      await (await el.$(".TCYkdd")).getProperty("innerText")
    ).jsonValue();

    //GET TIME
    try {
      eventsTime = await (
        await (await el.$(".TCYkdd")).getProperty("innerText")
      ).jsonValue();
    } catch (error) {
      eventsTime = "the event is today";
    }

    //GET DATE
    eventDate = await (
      await (await el.$(".t3gkGd")).getProperty("innerText")
    ).jsonValue();

    //GET URL
    eventsUrl = `https://www.google.com/search?q=${eventsTitle
      .split(" ")
      .join("+")}+${eventsSite.split(" ").join("+")}`;

    //ADD EVENTS DATA TO ARRAY LIST
    eventList.push({
      event_title: eventsTitle,
      event_extract: eventsSite,
      event_category: "event",
      event_url: eventsUrl,
      event_time: eventsTime,
      event_date: eventDate,
    });
  }

  //OUTPUT FILE
  await createOutputFile("google_events.json", eventList);

  console.log("finish google events scraping");
  //process.exit(0);
}

export default googleEvents;
