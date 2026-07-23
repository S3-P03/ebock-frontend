# ebock-frontend
This repository contains the files for the React client of EBock, built with React, using MUI for components and styling.

Copy the .env and .env.build files from the Teams group into the root of this project. These files contain environment variables that are required to run the projet in development build or to build the application.

## Requirements

    - Node.js
    - npm
    - Apache Maven
    - VS Code (Recommended)

## Startup

To get started with the app, run the following commands in a command prompt, at the root of the project.
### `npm install`
To install all the necessary dependencies used by the application.
### `npm run deploy-theme`
To build the custom keycloak login and register pages. Docker and Apache Maven are required to run this command.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner.
As a default, will run only the tests affected by changes. In the interactive test runner, press **a** to run all tests.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
This build is used by infra as the deployed application.

## Structure
The project is divided into folders, following the standard structure for React apps. Separated as components, contexts, hooks, interfaces, pages, services and tests.

## Contribution
Work must not be done directly in the main and dev branches. A branch must be created for every task, named after the associated Jira ticket.
Commits must specify the changes done.
Every feature is expected to be tested, using the **src/tests** package, with unit tests.
Once a feature is functional, tested and documented, a pull request must be opened toward the **dev** branch. Two reviews must then be submitted.
Once two contributors have reviewed the pull request, the creator can merge into dev using **Squash & merge**.
**IMPORTANT : The branch should be deleted once the pull request is merged.**