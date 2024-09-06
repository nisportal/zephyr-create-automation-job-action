## Zephyr Create and Execute Automation Job Action

This GitHub Action uploads a test results file to Zephyr and creates/executing an automation job using Zephyr's API.

### Features
- Upload a test results file (e.g., `zephyr.xml`).
- Create and execute an automation job in Zephyr.
- Supports configurable options for job details like `cycleName`, `releaseId`, `projectId`, `automationFramework`, and more.
  
### Inputs

| Input                | Description                                                                                       | Required | Example                                | Type           |
|----------------------|---------------------------------------------------------------------------------------------------|----------|----------------------------------------|----------------|
| `filePath`           | The file path for the automation test results file                                                | `true`   | `./path/to/zephyr.xml`                 | `string`       |
| `releaseId`          | The release ID                                                                                    | `true`   | `5`                                    | `Integer`      |
| `jobName`            | The job name                                                                                      | `true`   | `My Automation Job`                    | `String`       |
| `automationFramework`| The automation framework (e.g., `Cucumber`, `JUnit`, etc.)                                        | `true`   | `Cucumber`                             | `String`       |
| `cycleName`          | The name of the cycle in Zephyr where this job will run                                           | `true`   | `GITHUB ALEX RUN`                      | `String`       |
| `jobDetailTcrCatalogTreeId` | The ID of the test case repository item                                                    | `true`   | `8921`                                 | `Integer`      |
| `projectId`          | The project ID                                                                                    | `true`   | `1`                                    | `Integer`      |
| `testRepositoryPath` | The test repository path in Zephyr where the test case resides                                    | `true`   | `Release 3.2 > Automation_Scripts`     | `string`       |
| `cycleStartDateStr`  | The start date of the test cycle in mm/dd/yyyy format                                             | `true`   | `12/13/2023`                           | `String`       |
| `cycleEndDateStr`    | The end date of the test cycle in mm/dd/yyyy format                                               | `true`   | `12/20/2023`                           | `String`       |
| `isReuse`            | Whether to reuse the same cycle for multiple runs (set to `true` or `false`)                      | `true`   | `false`                                | `true or false`|
| `timeStamp`          | Whether to include a timestamp in the cycle (set to `true` or `false`)                            | `true`   | `true`                                 | `true or false`|
| `createPackage`      | Whether to create a package for the test results (set to `true` or `false`)                       | `true`   | `false`                                | `true or false`|
| `assignResultsTo`    | The ID of the user to whom the test results should be assigned                                    | `true`   | `-10`                                  | `Integer`      |
| `phaseName`          | The name of the phase in which the test should be executed                                        | `true`   | `Automation_Scripts`                   | `String`       |
| `zephyrBaseUrl`      | The base URL of the Zephyr server                                                                 | `true`   | `https://instancename.yourzephyr.com`  | `string`       |
| `zephyrApiToken`     | Your Zephyr API token, typically stored as a secret in GitHub                                     | `true`   | `${{ secrets.ZEPHYR_API_TOKEN }}`      | `string`       |

### Example Workflow

Below is an example GitHub Actions workflow using this custom action. This workflow demonstrates how to execute a Zephyr automation job as part of a CI pipeline after tests are run.

```yaml
name: Run Zephyr Automation Job

on:
  workflow_dispatch: # Manually triggered
  push: # Triggered on push to the repo

jobs:
  create-zephyr-job:
    runs-on: ubuntu-latest

    steps:
    # Step 1: Checkout the repository
    - name: Checkout code
      uses: actions/checkout@v2

    # Step 2: Run your tests (for example, using Maven)
    - name: Run Tests
      run: |
        mvn clean test
        # Assuming test results are saved as zephyr.xml in the target directory

    # Step 3: Upload and create the automation job in Zephyr
    - name: Create and Execute Zephyr Automation Job
      uses: your-username/zephyr-create-automation-job-action@v1.0.0
      with:
        filePath: './target/zephyr.xml'                        # Path to the test results file
        releaseId: '5'                                         # Release ID in Zephyr
        jobName: 'GitHub Automation Job'                       # Job Name
        automationFramework: 'Cucumber'                        # Automation Framework (e.g., Cucumber, JUnit)
        cycleName: 'GITHUB RUN'                                # Name of the cycle
        jobDetailTcrCatalogTreeId: '8921'                      # ID of the test case repository
        projectId: '1'                                         # Project ID
        testRepositoryPath: 'Release 3.2 > Automation_Scripts' # Test repository path
        cycleStartDateStr: '12/13/2023'                        # Start date of the cycle
        cycleEndDateStr: '12/20/2023'                          # End date of the cycle
        isReuse: 'false'                                       # Reuse the same cycle for multiple runs
        timeStamp: 'true'                                      # Include timestamp
        createPackage: 'false'                                 # Create a package for the results
        assignResultsTo: '-10'                                 # Assign results to a user (ID)
        phaseName: 'Automation_Scripts'                        # Phase name
        zephyrBaseUrl: ${{ secrets.ZEPHYR_BASE_URL }}          # Zephyr base URL (store in GitHub secrets)
        zephyrApiToken: ${{ secrets.ZEPHYR_API_TOKEN }}        # Zephyr API token (store in GitHub secrets)
```

### Secrets
To securely store sensitive data such as your Zephyr API token and base URL, you should use **GitHub Secrets**. Here’s how you can set them up:

1. In your GitHub repository, go to **Settings**.
2. Select **Secrets** > **Actions**.
3. Add the following secrets:
   - `ZEPHYR_BASE_URL`: Your Zephyr base URL, e.g., `https://instancename.yourzephyr.com`.
   - `ZEPHYR_API_TOKEN`: Your Zephyr API token, which is used for authentication.

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

### Additional Notes

- **Error Handling**: If the action fails to execute successfully, it will output an error message. You can review the logs in the GitHub Actions workflow for detailed troubleshooting.
- **Customizing the Workflow**: You can customize the job names, and input parameters as per your Zephyr test case setup. Just ensure the values you pass correspond to the settings in your Zephyr instance.
- **Testing Locally**: You can use the [`act`](https://github.com/nektos/act) tool to test GitHub Actions workflows locally before pushing to GitHub.

---

This README provides a comprehensive overview of how to use the `Zephyr Create and Execute Automation Job` GitHub Action. It explains the inputs, offers an example workflow, and gives guidance on setting up the necessary secrets for secure API communication.
inspiration from
- https://github.com/milanverma/cucumber-demo/blob/main/.github/workflows/my.yml
- https://zephyrdocs.atlassian.net/wiki/spaces/ZE/pages/3456598141/API+Operations+for+Automation+Jobs#Create-and-execute-a-job