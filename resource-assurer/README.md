# Resource Assurer
A client's application is represented by a browser extension.

## Getting Started

### Prerequisites

What things you need to install the software and how to install them

* [Node.js](https://nodejs.org/en/) - install node js to be able to run **npm** commands
* [FireFox](https://www.mozilla.org/en-US/firefox/new/) - Browser extension prototype is supported only on given browser

### Installing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.1.

Install all required dependencies by running the following command in the same root, where [package.json](package.json) file  is located

```
npm install
```


### Build

Run one of the following commands to build the project. The built artifacts are stored in the `dist/` directory.

Create *staging* artifacts for regular detached application. Configures the browser extension with development related configurations (blockchain endpoint, development account and private key, etc.)

```
npm run staging
```

Create *development* artifacts that auto-refresh on any change in the code. Configures the browser extension with development related configurations (local blockchain endpoint, development account and private key, etc.)

```
npm run start
```

Create *production* artifacts. No default configurations are set (not a recommended option for testing)

```
npm run build
```

### Run in browser

Current version of **Resource Assurer** fully executes on FireFox browsers. In order to run it, follow next steps:

1. Open FireFox browser
1. Go to `about:debugging#/runtime/this-firefox` in URL field
1. Click on __Load Temporary Add-on...__ 
1. Select `manifest.json` file from `/dist` directory, where the `npm run staging` was executed

The corresponding icon is shown in extensions bar of the browsers.

### Testing

1. **Integrity**
    1. Navigate to any open source WEB site. For example, [WhisperKey](https://www.whisperkey.io/)
    1. Open the extension pop-up and observe all the resources, relating to the web application. At this stage they are not published to the blockchain
    1. Publish any resource by putting code repository URI of a resource
    1. Check the EOS Studio in Contracts, under the resources dropdown the data table info can be found, related to previously published resources
1. **Reliability**
    1. Navigate to the list of resources, relating to WEB site
    1. Now, it should be possible to report a resource review on previously published resource
    1. Since the report is posted to the blockchain, referendum process is enabled for voting. All time limits (referendum expiration, hold and freeze periods) are reduced for the development/staging mode
    1. Put an up-vote or down-vote on a report
    1. Referendum can be expired manually in 10 seconds after posting, if development mode is enabled (a week for production mode)
    1. The positiveness threshold is set to 50% as default. A progress bar on the resources list shows a reliability level per published & reported resource
