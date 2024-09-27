# Triggre Test Assignment Readme

## How to use a demo

The app is divided into 2 main sections. "Control panel" on the left and "Content panel" on the right. 

### Content panel

In the "Content panel" user can click on the elements to select them and use selected element in the "Control panel". Selected element is highligted. By default root element is selected.

### Control panel

In the "Control panel" there are next elements: 
- "Buttons toolbar" - used to trigger actions with selected element
- "Color legend" - contains a list of colors which used to display an element status
- "Selected Element Information" - displays an information about currently selected element like it's selector and widget name
- "Init log" - contains a list initialization processes triggered with theirs colored status and a list of errors in case initialization is finished with errors

### Buttons toolbar

Next actions can be performed with toolbar buttons:
- "Init" - runs an initialization process on a selected element with it's children elements and widgets.
- "Destroy" - calls a "destroy" API on the selected element. Finishes widget's initialization with the "WidgetDestroyed" error.
- "Done" - calls a "finish" API on the selected element. Finishes widget's initialization without any errors.
- "Fail" - calls a "fail" API on the selected element. Leads to an widget initialization to be failed with an error text "Failed via API"

## How to run the demo server

1. Web server uses the port 3030. Make sure it's not in use.
2. When the server is running open the link http://localhost:3030
3. There are "start.bat" and "start.sh" files can be used to start the demo server. Just launch it and open the link specified in point 2. Alternatively you can install and run server from the command line following next steps:
4. Open the terminal in the root directory
5. (Optional) Run "npm install" to install dependencies. Can be skipped if dependencies are aready installed.
6. Run "npm start" command to start the web server.
7. Open the link specified in point 2

## How to run tests

1. Open the command line in the "xlib" directory
2. (Optional) Run "npm install" to install dependencies. Can be skipped if dependencies are aready installed.
3. Run "npm test" command to run all tests
