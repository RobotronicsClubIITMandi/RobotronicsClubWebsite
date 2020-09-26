# Want to contribute?

## Starting the server
Remember this project works on Node.js. So if you don't have Node.js, install it. Search on google.

1. First fork the repo and then clone your forked repo.
2. Then move to the main_site directory
```
cd main_site
```
3. After installing Node.js. Install dependencies using npm  
```
npm install
```
4. Now you need a configuration file to run the server. so, for that create a `config` folder in the `main_site` folder. Then create a file `development.json` with the following content.
```
{
    "name": "Development Mode",
    "dbUrl": "you need to create a mongoDB atlas and add the database URL here",
    "adminUsername": "admin",
    "adminPassword": "admin",
    "mailFromEmail": "robotronics@students.iitmandi.ac.in",
    "mailFromPassword": "",
    "mailToEmail": "robotronics@students.iitmandi.ac.in"
}
```

Change the `dbUrl` with the mongoDB database URL, you want to use. you may use the local mongoDb server or the MongoDB atlas for development.

5. Finally after adding the connection String, run the server using
```bash
npm start
```
The server will be started at **http://localhost:3000**

### (Optional)
You may better use _nodemon_ to start the development server.<br />
To install nodemon
* On Windows run 
```
npm install -g nodemon
```
* On Ubuntu run 
```
sudo npm install -g nodemon
```

This will install the nodemon, after this you can run the server using the following command 
```
nodemon
``` 
It will start the development server.


# Contribution Guide
First clone and try to play with code and start the server using the above steps. Then check here on the issues tab for `good first issues` if you want to start working. They are generally easy and are good to get started upon.

To claim the issuse and show that you are working on it, comment down the issue you want to work upon. We will assign accordingly. 

**Try and Learn! Happy Contributing**
