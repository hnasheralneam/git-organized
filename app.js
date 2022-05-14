/* =============
// Data
============= */
// System variables (These are basically JS libraries)
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

let signedInUser = "(not signed in)";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");

// Mongoose things
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://Squirrel:nCCJ0sQuQQ5qhGsn@test-user-data.daqv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });

// System things
connection.on("error", console.error.bind(console, "Connection error: "));

// Schemas
const userSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   bio: String,
   links: [],
   dateAccountStarted: Date,
   userCall: String,
   projects: [], // list of project ids
   actions: [] // a list of action ids
});

const projectSchema = new mongoose.Schema({
   creater: String, // userCall of creator (userCall is used as userID)
   contributors: [],
   description: String,
   id: String,
   name: String,
   dateCreated: Date,
   activity: [],
   comments: [], // laaaaaaaaaater
   data: [] // arr of cards
});

const actionSchema = new mongoose.Schema({
   userCall: String, // userCall of action do-er
   location: String,
   type: String,
   text: String,
   time: Date,
   id: String
});

let cardTemplate = {
   status: String,
   subcards: [],
   actions: [],
   contributors: [],
   name: String,
   description: String,
   tags: [],
   priority: String,
   difficulty: String,
   assignees: [],
   estTime: String,
   dueDate: Date,
   dateCreated: Date,
   creator: String
}




/*
so here's what we'll do
all action will be saved straight to the database, and will only be referenced by their uuid in the appropriate locations
*/

// Set the schemas
const DevData = mongoose.model("DevData", userSchema);
const ProjectData = mongoose.model("ProjectData", projectSchema);
const ActionData = mongoose.model("ActionData", actionSchema);

// let summat = uuidv4();
// const newaUser = new ProjectData({
//    userCall: "squirrel", // userCall of action do-er
//    location: "home>projects",
//    type: `create>${summat}`,
//    text: "Created a project called Test Project",
//    time: Date.now(),
//    id: uuidv4()
// });
// newaUser.save(function (err, newUser) { if (err) return console.error(err); });
// ActionData.find((err, actions) => {
//    if (err) { console.error(err); }
//    else { actions.forEach(element => console.log(element)) }
// });
// DevData.find((err, actions) => {
//    if (err) { console.error(err); }
//    else { actions.forEach(element => console.log(element)) }
// });
// ProjectData.find((err, actions) => {
//    if (err) { console.error(err); }
//    else { actions.forEach(element => console.log(element)) }
// });


// DevData.findOneAndUpdate(
//    { _id: "62378bfb529354830979f954" }, 
//    { $push: { actions: summat } },
//    function (error, success) {
//       if (error) {
//          console.log(error);
//       } else {
//          console.log(success);
//       }
//    }
// );

// ProjectData.findByIdAndDelete("62378fef65ad7e3382672737", function (err, docs) {
//    if (err) { console.log(err); }
//    else { console.log("Deleted : ", docs); }
// });


// const newUser = new ProjectData({
//    creater: "squirrel", // userCall of creator (userCall is used as userID)
//    contributors: ["squirrel"],
//    description: "The very firstest test project, created directly through app.js with mongoose. Sigh. Well, here goes.",
//    id: summat,
//    name: "Test Project",
//    dateCreated: Date.now(),
//    activity: [],
//    comments: [], // laaaaaaaaaater
//    data: [] // arr of cards
// });
// newUser.save(function (err, newUser) { if (err) return console.error(err); });



/* =============
// Processing
============= */

// Sign in
function signIn(userInfo) {
   signedIn = true;
   signedInUser = userInfo;
}

// Basic data for each page
function getNewpageData() {
   return new Promise(resolve => {
      DevData.find((err, users) => {
         if (err) { console.error(err); }
         else { 
            ActionData.find((err, actions) => {
               if (err) { console.error(err); }
               else {
                  ProjectData.find((err, projects) => {
                     if (err) { console.error(err); }
                     else { 
                        let returnData = {
                           user: signedInUser,
                           users: users,
                           actions: actions,
                           projects: projects
                        }
                        resolve(returnData);
                        return returnData;
                     }
                  });
               }
            });
         }
      });
   });
}

/* =============
// Get requests
============= */

// Public user pages

app.get("/", (req, res) => { goSomewhere(res, "home"); });
app.get("/projects", (req, res) => { goSomewhere(res, "projectsPage"); });
app.get("/account", (req, res) => { goSomewhere(res, "account"); });

// app.get("/users/:username", (req, res) => {
//    UserData.findOne({ name: req.params.username }, (err, user) => {
//       if (err) { console.error(err); }
//       else if (user == null) { res.render("no-such-user"); }
//       else { res.render("user-profile", { user: user, name: user.name }); }
//    });
// });

// Temporary landings
app.get("/sign-out", (req, res) => {
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

function goSomewhere(res, where) {
   letsGo();
   async function letsGo() {
      let returnedData = await getNewpageData();
      res.render(where, returnedData);
   }
}

/* =============
// Account
============= */

// Sign in
app.post("/signin", (req, res) => {
   DevData.findOne({ name: req.body.name, passcode: req.body.pscd }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.send("The data dosen't line up. Try again!"); }
      else if (user) {
         signIn(user);
         res.redirect("/");
      }
   });
});         

// Get all lost requests
app.get("*", (req, res) => {
   res.render("page-not-found");
});

app.listen(port);
