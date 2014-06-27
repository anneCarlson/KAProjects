------
README
------

A high level description of the Khan Academy Frameworks application, by Annie Carlson, William Zimrin, and Sam Dooman
CSCI 1320 : Introduction to Modern Web Applications

--------------------------
Installation and Execution
--------------------------

Below are instructions for cloning this project (Mercurial is required). 

hg clone http... projectName
npm install
cd app/public/perseus
npm install
git submodule init
git submodule update
make debug

OR download the .zip file containing the project and unzip to a specified directory.

From there, run 'node app' in the KhanAPI directory to start the server.  This server will automatically
run on port 8080.

-----------------------
Application Information
-----------------------

The server file is written in Node.js, with primary files being app/server/router.js, app/server/modules/account-manager.js,
app/server/api/apiCaller.js and app/server/api/userAuthentication.js.  The frontend is primarily jade templated HTML files
stored in app/server/views, with necessary CSS & javascript in the app/public/css and app/public/js/ directories, respectively.
Most of the additional code is from external libraries, mainly from https://github.com/braitsch/node-login and https://github.com/Khan/perseus, two opensource projects.

The frontend relies on the Knockout.js and jQuery libraries, and the backend relies on the Express.js, Mongoose.js, and q.js 
modules.  

------------
Known Issues
------------

The system occasionally logs users out earlier than intended.  Other
bugs may be reported to anne_carlson@brown.edu or samuel_dooman@brown.edu.

