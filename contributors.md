# Want to contribute?

1. First fork the repo and then clone your forked repo.
2. Run 
```
cd main_site
```
3. Install dependencies using npm  
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
Here `dbURL` is the mongoDB databse URL which you want to use which we will suggest to create a mongoDB atlas

5. Now run 
```
npm start
```

You may better use nodemon to start the development server.<br />
To install nodemon
* On Windows run 
```
npm install -g nodemon
```
* On Ubuntu run 
```
sudo npm install -g nodemon
```
Now run 
```
nodemon
``` 
It will start the development server.
