const express=require('express');
const app=express();
const port=8000;
const db=require('./config/mongoose');
const cookieParser = require('cookie-parser');  // A Library for reading and writing into cookie

const expresslayouts=require('express-ejs-layouts');

// Used For session cookie (Authetication passport)
const session = require('express-session');
const passport = require('passport');
const passportLocal =  require('./config/passport-local-strategy');

// To set cookies data in persistance storage we using MongoStore
const MongoStore = require('connect-mongo'); // This library require an argument which is express session

const sassMiddleware = require('node-sass-middleware');

// For flash Notification
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

// Now we have to tell we using cookie-parser
app.use(cookieParser());

app.use(express.urlencoded());  // To parse form POST and get request into body to read it
app.use(expresslayouts); 
// Now we have to tell in which foled our app should look out for local files (ex css images)
app.use(express.static('./assets')); // ./ tells location of neighbouring folders 

// makes the upload path availabe to browser
app.use('/uploads',express.static(__dirname+'/uploads'));   // joining the directory of index with uploads

// Extract style and script from sub pages into layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// We need to add an middleware which takes into that cookie and encrypts it
// mongostore is used to store the cookie in the db
app.use(session({
    name: 'codial',
    // TODO Change the secret before deployment in producation mode
    secret: 'blahsomething', // It's The key used for encoding and decoding
    saveUninitialized: false,
    resave : false,
    cookie : { // Giving age to the cookie how log this expire
        maxAge:(1000*60*100) // Time in milisecond 
    },
    store: MongoStore.create(
        {
            mongoUrl:'mongodb://localhost/codeial_development',
            autoRemove: 'disable' // Do it want to remove this automatically
        }
    ),
    function(err){ // A callback function in case the connection is not establish
        console.log(err || 'connect-mongodb setup ok');
    }
}));

// Telling app to use passort
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// we need to put this after the session use as it users session cookies
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});