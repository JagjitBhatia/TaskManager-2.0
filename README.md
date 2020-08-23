# Task Manager (2.0)
An advanced version of the PTMS task manager; The completed project will consist of a Node.js API, a query to build the full MySQL database, and a deployable client web application in React.js

**Version 1.0**  
This first release will be an end-to-end web application that supports a single user. The release will consist of a React web client application, a Node + Express REST API with real-time notifications via Socket.IO, a SQL query for building the TaskManagerDB in MySQL, and scripts/instructions for running the web app.

**Current Status:**  
Version 1.0 Complete!!

**Build Instructions:** 

The following instructions assume MySQL is installed.

Database Setup:
1. In a MySQL Shell or command window, run DatabaseBuilder.sql to create 'TaskManagerDB'
2. Create or use existing user with password, e.g. username: 'user123', password: 'bestpassword'
3. Provide 'user123'@'localhost' with ALL privileges to 'TaskManagerDB'

Server Setup:
1. cd into TaskManager-2.0/server
2. Run 'npm install' to install all dependencies
3. To start server, run 'node server.js --user user123 --password bestpassword' (assuming above credentials)

Client Setup:
1. (In another command-line window) cd into TaskManager-2.0/client-app
2. Run 'npm install' to install all dependencies
3. Run 'npm start' to start React application
4. Open web browser and go to 'localhost:2000'
5. Voila! Behold the power of the Task Manager
