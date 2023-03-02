import puppeteer from "puppeteer";

import fetch from "node-fetch";
import { load } from "cheerio";
import fs from "fs";
import { FormData } from "formdata-node";
import { FormDataEncoder } from "form-data-encoder";
import { Readable } from "stream";
import path from "path";
/*

AIRBNB DATA

*/

init();

async function init() {
  //DIFENE GEOLOCATION AND FINE URI OF AIRBNB
  const geoLocation = "Indianapolis";
  const urlAirbnb = `https://www.airbnb.com/s/${geoLocation}/homes?&pagination_search=true&items_offset=10`;
  const browser = await puppeteer.launch({
    headless: true,
    waitForInitialPage: 200,
  });
  const page = await browser.newPage();
  await page.goto(urlAirbnb);

  //GET JSON FILE OF AIRBNB
  //id="data-deferred-state" data-deferred-state="true"
  await page.waitForSelector("#data-deferred-state");
  const content = await page.$("#data-deferred-state");
  //let content = await page.$("script");
  let getJsonData = (await content.getProperty("textContent")).jsonValue();
  getJsonData.then((data) => {
    let convertJSON = JSON.parse(data);
    let getSectionLengthAirbnb =
      convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
        .sections.sections.length;
    let exploreGetData = "";
    let validateGetSearchData = false;
    for (let index = 0; index < getSectionLengthAirbnb; index++) {
      try {
        exploreGetData =
          convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
            .sections.sections[index].section;
        //section.child.section.items
        console.log(exploreGetData);
        validateGetSearchData = true;
      } catch (error) {
        console.log(error);
      }
    }
    /*
     let getSectionLengthAirbnb =
        convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
          .sections.sections.length;
      let exploreGetData = "";
      let validateGetSearchData = false;
      for (let index = 0; index < getSectionLengthAirbnb; index++) {
        try {
          exploreGetData =
            convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
              .sections.sections[index].section.child.section.items;
          validateGetSearchData = true;
        } catch (error) {}
      }
      if (validateGetSearchData == true) {
        let airbnbDataHotels = [];
        for (const searchAirbnb of exploreGetData) {
          let tmpAirbnbDataPicture = [];
          let tmpAirbnbDataCaption = [];

          
            Title
            searchAirbnb.listing.name

            Get id for generate href
            searchAirbnb.listing.id

            Id and images 
            searchAirbnb.listing.contextualPictures

            Latitude and Longitude
            searchAirbnb.listing.lat
            searchAirbnb.listing.lng

            Person Capacity
            searchAirbnb.listing.pdpUrlType
            searchAirbnb.listing.personCapacity

            Utilities or addons 
            searchAirbnb.listing.previewAmenityNames

            Mount and currency
            searchAirbnb.pricingQuote.rate.amountFormatted
            searchAirbnb.pricingQuote.rate.currency

            Type price
            searchAirbnb.pricingQuote.rateType

            Rating
            searchAirbnb.listing.avgRating

            

          for (const getCaption of searchAirbnb.listing.contextualPictures) {
            //GET PICTURE
            tmpAirbnbDataPicture.push(getCaption.picture);
            if (getCaption.caption != null) {
              //CAPTION MESSAGE
              tmpAirbnbDataCaption.push(getCaption.caption.messages);
            }
          }
          airbnbDataHotels.push({
            title: searchAirbnb.listing.name,
            href: `https://www.airbnb.com/rooms/${searchAirbnb.listing.id}`,
            picture: tmpAirbnbDataPicture,
            lat_long:
              "" +
              searchAirbnb.listing.lat +
              ", " +
              searchAirbnb.listing.lng +
              "",
            rooms:
              searchAirbnb.listing.pdpUrlType +
              " " +
              searchAirbnb.listing.personCapacity,
            addons: searchAirbnb.listing.previewAmenityNames,
            mount:
              searchAirbnb.pricingQuote.rate.amountFormatted +
              " " +
              searchAirbnb.pricingQuote.rate.currency,
            caption: tmpAirbnbDataCaption,
            rating: "" + searchAirbnb.listing.avgRating + "",
          });
        }
    
    */
  });
  //let convertJSON = JSON.parse(jsonData);
  //console.log(convertJSON);
  //fs.writeFileSync("demo.txt", content);
}
//setInterval(init, 61200000);
/*
function init() {
  //DIFENE GEOLOCATION AND FINE URI OF AIRBNB
  const geoLocation = "Indianapolis";
  const urlAirbnb = `https://www.airbnb.com/s/${geoLocation}/homes?&pagination_search=true&items_offset=`;
  const pageUrl = 2;

  //CALL FUNCTION ASYNC AND GET DATA OF WEBSITE WITH FETCH AND CHEERIO
  async function getDataUrlAirbnb(URL, page) {
    let data = "";
    const indexPage = page * 10;
    const response = await fetch(URL + indexPage);
    data = response.text();
    return data;
  }

  const getAirbnbArrayData = getDataUrlAirbnb(urlAirbnb, pageUrl).then(
    (content) => {
      console.log(content);
      const $ = load(content);
      
    GET JSON FILE OF AIRBNB
    id="data-deferred-state" data-deferred-state="true"
    
      let jsonData = $("#data-deferred-state").html();
      let convertJSON = JSON.parse(jsonData);
      let getSectionLengthAirbnb =
        convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
          .sections.sections.length;
      let exploreGetData = "";
      let validateGetSearchData = false;
      for (let index = 0; index < getSectionLengthAirbnb; index++) {
        try {
          exploreGetData =
            convertJSON.niobeMinimalClientData[0][1].data.presentation.explore
              .sections.sections[index].section.child.section.items;
          validateGetSearchData = true;
        } catch (error) {}
      }
      if (validateGetSearchData == true) {
        let airbnbDataHotels = [];
        for (const searchAirbnb of exploreGetData) {
          let tmpAirbnbDataPicture = [];
          let tmpAirbnbDataCaption = [];

          
            Title
            searchAirbnb.listing.name

            Get id for generate href
            searchAirbnb.listing.id

            Id and images 
            searchAirbnb.listing.contextualPictures

            Latitude and Longitude
            searchAirbnb.listing.lat
            searchAirbnb.listing.lng

            Person Capacity
            searchAirbnb.listing.pdpUrlType
            searchAirbnb.listing.personCapacity

            Utilities or addons 
            searchAirbnb.listing.previewAmenityNames

            Mount and currency
            searchAirbnb.pricingQuote.rate.amountFormatted
            searchAirbnb.pricingQuote.rate.currency

            Type price
            searchAirbnb.pricingQuote.rateType

            Rating
            searchAirbnb.listing.avgRating

            

          for (const getCaption of searchAirbnb.listing.contextualPictures) {
            //GET PICTURE
            tmpAirbnbDataPicture.push(getCaption.picture);
            if (getCaption.caption != null) {
              //CAPTION MESSAGE
              tmpAirbnbDataCaption.push(getCaption.caption.messages);
            }
          }
          airbnbDataHotels.push({
            title: searchAirbnb.listing.name,
            href: `https://www.airbnb.com/rooms/${searchAirbnb.listing.id}`,
            picture: tmpAirbnbDataPicture,
            lat_long:
              "" +
              searchAirbnb.listing.lat +
              ", " +
              searchAirbnb.listing.lng +
              "",
            rooms:
              searchAirbnb.listing.pdpUrlType +
              " " +
              searchAirbnb.listing.personCapacity,
            addons: searchAirbnb.listing.previewAmenityNames,
            mount:
              searchAirbnb.pricingQuote.rate.amountFormatted +
              " " +
              searchAirbnb.pricingQuote.rate.currency,
            caption: tmpAirbnbDataCaption,
            rating: "" + searchAirbnb.listing.avgRating + "",
          });
        }
        return airbnbDataHotels;
      } else {
        return "NO HAVING DATA";
      }
    }
  );

  getAirbnbArrayData.then((data) => {
    //UPLOAD FILE TO STRAPI
    for (let index = 0; index < data.length; index++) {
      //PREPARE NEW OBJECT
      let sendData = {
        title: data[index].title,
        url: data[index].href,
        price: data[index].mount,
        features: String(data[index].addons),
        content: String(data[index].caption),
        rating: data[index].rating,
        image: data[index].picture,
        latitudelongitude: data[index].lat_long,
      };
      //CREATE FORMDATA
      let formData = new FormData();
      formData.set("data", JSON.stringify(sendData));
      const encoder = new FormDataEncoder(formData);
      //SEND FORMDATA TO STRAPI
      fetch("http://gardenaecondev.com/backend/api/hotels", {
        method: "post",
        headers: encoder.headers,
        body: Readable.from(encoder),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("Hotel " + data[index].title + " Submit");
          } else {
            console.log("Error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    //GET DATE
    let date = new Date();
    let getDay = date.getDay();
    let getMount = date.getMonth();
    let getYear = date.getFullYear();
    let getHours = date.getHours();
    let getMinutes = date.getMinutes();
    //GET ROOT FILE
    let getRootFile = process.cwd();
    //CREATE JSON FILE
    if (!fs.existsSync(path.join(getRootFile, "tmp"))) {
      fs.mkdirSync(path.join(getRootFile, "tmp"), { recursive: true });
    }
    fs.writeFileSync(
      path.join(getRootFile, "tmp") +
        "/airbnb_" +
        getDay +
        "_" +
        getMount +
        "_" +
        getYear +
        "_" +
        getHours +
        "_" +
        getMinutes +
        ".json",
      JSON.stringify(data),
      { encoding: "utf8", flag: "w", mode: 0o666 }
    );
  });
}




$puppeteer = new Puppeteer;
            $browser = $puppeteer->launch(["headless" => true, "slowMo" => 100, "timeout" => 0, "args" => ["--no-sandbox", "--disable-setuid-sandbox"]]);
            //OPEN NEW PAGE 
            $page = $browser->newPage();
            $page->goto($url);
            $page->setDefaultNavigationTimeout(90000);
            
            //COMPLETE IMPUTS SEARCH USER
            $page->type("input[name=systemUser_firstName]",$personName);
            $page->type("input[name=systemUser_lastName]",$personLastName);
            $page->keyboard->press("Enter");
            
            sleep(1);
            
            //GET LIST OF PERSON
            $getListByPerson = $page->querySelectorAll("tbody > tr > td > a.underlined");
            //GET NAME PERSON
            //$getPerson = $getListByPerson[0]->getProperty("innerText")->jsonValue();
            
            if(count($getListByPerson) == 0){
               return json_encode(array("success"=>-1, "message"=>"person not exists"));
            }
            //OPEN BOOKS OF PERSON
            $getListByPerson[0]->click();

            sleep(1);

            $getBookOfPerson = $page->querySelectorAll("body > table > tbody > tr > td > table");
            $getBookHTMK = $getBookOfPerson[1]->getProperty("innerHTML")->jsonValue();
            $prepareData = array([
                "name"=>$fullNamePerson,
                "book"=>$getBookHTMK
            ]);

            checkOutputfile($fullNamePerson, json_encode($prepareData),true);
            $browser->close();

            return json_encode(array("success"=>1, "message"=>"file created"));
*/
