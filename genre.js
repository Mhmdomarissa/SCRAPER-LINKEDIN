

//  CHARBEL : In the initial code, you can extract data page by page instead of retrieving all the pages at once.
//  In the given URL, you will notice the parameters 'num0' and 'start7'. By modifying the 'start' parameter to values such as 0, 25, or any other desired number, 
//  you can access and extract the data for specific pages.



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// const url = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/mlops-engineer-jobs?position=1&pageNum=0&start=7';

// axios.get(url)
//   .then(response => {
//     const html = response.data;
//     const $ = cheerio.load(html);

 
//     const extractJobDetails = () => {
//       const jobDetails = [];
//       $('li > div.base-card').each((index, element) => {
//         const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
//         const companyName = $(element).find('h4.base-search-card__subtitle').text().trim();
//         const jobLocation = $(element).find('span.job-search-card__location').text().trim();
//         const jobPostDate = $(element).find('time.job-search-card__listdate').attr('datetime');
//         const applicationLink = $(element).find('a.base-card__full-link').attr('href');

//         jobDetails.push({
//           jobTitle: jobTitle || 'No title available',
//           companyName: companyName || 'No company name available',
//           jobLocation: jobLocation || 'No location available',
//           jobPostDate: jobPostDate || 'No post date available',
//           applicationLink: applicationLink || 'No application link available'
//         });
//       });
//       return jobDetails;
//     };

   
//     const jobDetails = extractJobDetails();

   
//     fs.writeFileSync('jobDetails.json', JSON.stringify(jobDetails, null, 2), 'utf-8');
//     console.log('Job details saved to jobDetails.json');
//   })
//   .catch(error => {
//     console.error('Error fetching the page:', error);
//   });


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/mlops-engineer-jobs?position=1&pageNum=';

const fetchJobListings = async (page) => {
  try {
    const response = await axios.get(`${baseUrl}${page}&start=${page * 25}`);
    const html = response.data;
    const $ = cheerio.load(html);

    const jobDetails = [];
    $('li > div.base-card').each((index, element) => {
      const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
      const companyName = $(element).find('h4.base-search-card__subtitle').text().trim();
      const jobLocation = $(element).find('span.job-search-card__location').text().trim();
      const jobPostDate = $(element).find('time.job-search-card__listdate').attr('datetime');
      const applicationLink = $(element).find('a.base-card__full-link').attr('href');

      jobDetails.push({
        jobTitle: jobTitle || 'No title available',
        companyName: companyName || 'No company name available',
        jobLocation: jobLocation || 'No location available',
        jobPostDate: jobPostDate || 'No post date available',
        applicationLink: applicationLink || 'No application link available'
      });
    });
    return jobDetails;
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return [];
  }
};

const saveJobListings = async () => {
  let allJobDetails = [];
  let page = 0;
  let morePages = true;

  while (morePages) {
    const jobDetails = await fetchJobListings(page);
    if (jobDetails.length === 0) {
      morePages = false;
    } else {
      allJobDetails = allJobDetails.concat(jobDetails);
      page += 1;
      console.log(`Fetched page ${page}, total jobs: ${allJobDetails.length}`);
    }
  }

  fs.writeFile('allJobDetails.json', JSON.stringify(allJobDetails, null, 2), 'utf-8', (err) => {
    if (err) throw err;
    console.log('All job details saved to allJobDetails.json');
  });
};

saveJobListings();



