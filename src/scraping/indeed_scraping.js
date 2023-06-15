import { createOutputFile, createNewPage } from "../utils/kit.js";

async function indeed() {
  console.log("run indeed scraping");
  async function searchAllJobsAndExportData(page, arrayJobs, numberPage) {
    //SHOW NUMBER PAGE OF INDEED
    console.log(`search data of page indeed ${numberPage}`);

    //VARIABLES
    let jobTitle,
      jobDescription = "has no specified description",
      jobCompanyName,
      jobCompanyLocation,
      jobSalary = "has no specified salary",
      jobUrl;

    //SEARCH ALL INDEED JOBS
    const searchJobsList = await page.$$(
      "ul.jobsearch-ResultsList > li > div.cardOutline"
    );
    for (const [index, el] of searchJobsList.entries()) {
      //GET JOB URL
      jobUrl = await (
        await (
          await el.$(
            ".job_seen_beacon table tbody tr .resultContent .jobTitle a"
          )
        ).getProperty("href")
      ).jsonValue();

      //GET JOB TITLE
      jobTitle = await (
        await (
          await el.$(
            ".job_seen_beacon table tbody tr .resultContent .jobTitle a span"
          )
        ).getProperty("innerText")
      ).jsonValue();

      //GET JOB COMPANY
      jobCompanyName = await (
        await (
          await el.$(
            ".job_seen_beacon table tbody tr .resultContent .company_location .companyName"
          )
        ).getProperty("innerText")
      ).jsonValue();

      //GET JOB COMPANY LOCATION
      jobCompanyLocation = await (
        await (
          await el.$(
            ".job_seen_beacon table tbody tr .resultContent .company_location .companyLocation"
          )
        ).getProperty("innerText")
      ).jsonValue();

      //GET JOB DESCRIPTION
      //IF DESCRIPTION JOB IS NULL, ASSIGN DEFAULT VALUE
      let searchJobDescription = await el.$(
        ".job_seen_beacon table tbody tr td .result-footer .job-snippet ul li"
      );

      if (searchJobDescription != null) {
        jobDescription = await (
          await searchJobDescription.getProperty("innerText")
        ).jsonValue();
      }

      //GET JOB SALARY
      //IF SALARY JOB IS NULL, ASSIGN DEFAULT VALUE
      let searchJobSalary = await el.$(
        ".job_seen_beacon table tbody tr .resultContent .salaryOnly .attribute_snippet"
      );

      if (searchJobSalary != null) {
        jobSalary = await (
          await searchJobSalary.getProperty("innerText")
        ).jsonValue();
      }

      //PREPARE OBJECT
      let objJob = {
        job_url: jobUrl,
        job_tile: jobTitle,
        job_company: jobCompanyName,
        job_company_location: jobCompanyLocation,
        job_description: jobDescription,
        job_salary: jobSalary,
      };

      //PUSH DATA IN ARRAY jobsList
      arrayJobs.push(objJob);
    }

    //RETURN VALUES OF ARRAY
    return arrayJobs;
  }

  //VARIABLES OF CONFIGURATION
  const geoLocation = "Indianapolis";
  const pagesNumbers = 3;
  let pageCount = 1;

  //ARRAY OF OUTPUT DATA
  let jobsList = [];

  //SEARCH DATA BY PAGE IN 10 AND 10
  while (pageCount <= pagesNumbers) {
    let url = `https://www.indeed.com/jobs?q=&l=${geoLocation}&start=${
      pageCount * 10
    }`;
    let pageInit = await createNewPage(url);
    await searchAllJobsAndExportData(pageInit, jobsList, pageCount);
    pageCount++;
  }
  //OUTPUT FILE
  await createOutputFile("indeed_scrap.json", jobsList);

  console.log("finish indeed scraping");
  //process.exit(0);
}

export default indeed;
