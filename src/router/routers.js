import airbnb from "../scraping/airbnb_scraping.js";
import espnSports from "../scraping/espn_sports_scraping.js";
import googleEvents from "../scraping/google_events_scraping.js";
import indeed from "../scraping/indeed_scraping.js";
import wthr from "../scraping/wthr_scraping.js";
import express from "express";
const router = express.Router();

//ROUTERS
router.get("/", (req, res) => {
  res.render("index.html", { status: "", message: "" });
});

router.get("/web-scraping/:item", async (req, res) => {
  const { item } = req.params;

  switch (item) {
    case "espn-sports":
      await espnSports();
      await res.status(200).render("index.html", {
        message: `finish scraping ${item} check output folder in your proyect`,
        status: 1,
      });
      break;
    case "airbnb":
      await airbnb();
      await res.status(200).render("index.html", {
        message: `finish scraping ${item} check output folder in your proyect`,
        status: 1,
      });
      break;
    case "google-events":
      await googleEvents();
      await res.status(200).render("index.html", {
        message: `finish scraping ${item} check output folder in your proyect`,
        status: 1,
      });
      break;
    case "indeed":
      await indeed();
      await res.status(200).render("index.html", {
        message: `finish scraping ${item} check output folder in your proyect`,
        status: 1,
      });
      break;
    case "wthr":
      await wthr();
      await res.status(200).render("index.html", {
        message: `finish scraping ${item} check output folder in your proyect`,
        status: 1,
      });
      break;
    default:
      await res.status(400).render("index.html", {
        message: `invalid ${item} for scraping`,
        status: -1,
      });
      break;
  }
});

router.get("*", (req, res) => {
  res.status(400).render("index.html", {
    message: `url not exist for scraping`,
    status: -1,
  });
});

export default router;
