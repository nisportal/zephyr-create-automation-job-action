const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function run() {
  try {
    // Get inputs from action.yml
    const filePath = core.getInput('filePath');  // string
    const releaseId = parseInt(core.getInput('releaseId'), 10);  // integer
    const jobName = core.getInput('jobName');  // string
    const automationFramework = core.getInput('automationFramework');  // string
    const cycleName = core.getInput('cycleName');  // string
    const jobDetailTcrCatalogTreeId = parseInt(core.getInput('jobDetailTcrCatalogTreeId'), 10);  // integer
    const projectId = parseInt(core.getInput('projectId'), 10);  // integer
    const testRepositoryPath = core.getInput('testRepositoryPath');  // string
    const cycleStartDateStr = core.getInput('cycleStartDateStr');  // string
    const cycleEndDateStr = core.getInput('cycleEndDateStr');  // string
    const isReuse = core.getBooleanInput('isReuse');  // boolean
    const timeStamp = core.getBooleanInput('timeStamp');  // boolean
    const createPackage = core.getBooleanInput('createPackage');  // boolean
    const assignResultsTo = parseInt(core.getInput('assignResultsTo'), 10);  // integer
    const phaseName = core.getInput('phaseName');  // string
    const zephyrBaseUrl = core.getInput('zephyrBaseUrl');  // string
    const zephyrApiToken = core.getInput('zephyrApiToken');  // string

    // Log input values for debugging
    core.info(`File path: ${filePath}`);
    core.info(`Zephyr base URL: ${zephyrBaseUrl}`);
    core.info(`Release ID: ${releaseId}`);
    core.info(`Job Name: ${jobName}`);
    core.info(`Project ID: ${projectId}`);
    core.info(`Cycle Name: ${cycleName}`);
    core.info(`Automation Framework: ${automationFramework}`);

    // Create form data for the multipart/form-data request
    const formData = new FormData();
    formData.append('fileName', fs.createReadStream(filePath));  // Attach the file to the request
    formData.append('automationJobDetail', JSON.stringify({
      releaseId,
      jobName,
      automationFramework,
      cycleName,
      jobDetailTcrCatalogTreeId,
      projectId,
      testRepositoryPath,
      cycleStartDateStr,
      cycleEndDateStr,
      isReuse,
      timeStamp,
      createPackage,
      assignResultsTo,
      phaseName
    }));

    // Log the payload before sending the request
    core.info('Payload prepared for Zephyr:');
    core.info(JSON.stringify({
      releaseId,
      jobName,
      automationFramework,
      cycleName,
      jobDetailTcrCatalogTreeId,
      projectId,
      testRepositoryPath,
      cycleStartDateStr,
      cycleEndDateStr,
      isReuse,
      timeStamp,
      createPackage,
      assignResultsTo,
      phaseName
    }, null, 2));

    // Set the headers
    const headers = {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${zephyrApiToken}`
    };

    // Log headers for debugging (redact sensitive info)
    core.info('Request Headers:');
    core.info(JSON.stringify({
      ...headers,
      'Authorization': 'Bearer [REDACTED]'
    }, null, 2));

    // Make the POST request to Zephyr
    core.info('Sending POST request to Zephyr...');
    const response = await axios.post(
      `${zephyrBaseUrl}/flex/services/rest/v4/upload-file/automation/create-and-execute-job`,
      formData,
      { headers }
    );

    // Log the successful response
    core.info('Automation job created and executed successfully!');
    core.info(`Response Status: ${response.status}`);
    core.info(`Response Data: ${JSON.stringify(response.data, null, 2)}`);

    // Set the response data as output
    core.setOutput('response', response.data);

  } catch (error) {
    // Handle errors and log detailed information
    if (error.response) {
      core.error(`Error Status: ${error.response.status}`);
      core.error(`Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      core.error(`Error Message: ${error.message}`);
    }
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
