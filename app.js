/* =============
// Data
============= */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

let signedInUser = "(not signed in)";

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets/"));
app.use("/css", express.static(__dirname + "/css/"));
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
   actions: [],
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
app.get("/your-projects", (req, res) => { goSomewhere(res, "projectsPage"); });
app.get("/account", (req, res) => { goSomewhere(res, "account"); });
app.get("/new-project", (req, res) => { goSomewhere(res, "createNewProject"); });
app.get("/actions-history", (req, res) => { goSomewhere(res, "globalActions"); });

app.get("/project/:projectname", (req, res) => {
   ProjectData.findOne({ name: req.params.projectname }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("page-not-found"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("project-overview", returnedData);
         }
      }
   });
});

app.get("/edit-project/:projectname", (req, res) => {
   ProjectData.findOne({ name: req.params.projectname }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("page-not-found"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("edit-project", returnedData);
         }
      }
   });
});


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
app.post("/enter-account", (req, res) => {
   DevData.findOne({ username: req.body.name }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.send("There is no account with this name!"); }
      else if (user) {
         DevData.findOne({ username: req.body.name, password: req.body.pscd }, (err, user) => {
            if (err) return console.error(err);
            if (!user) { res.send("Wrong password!"); }
            else if (user) {
               signIn(user);
               res.send("Successful signin!");
            }
         });
      }
   });
});

/* =============
// New Project
============= */

function newAction(user, loc, type, text, time, id) {
   let newAction = new ActionData({
      userCall: user,
      location: loc,
      type: type,
      text: text,
      time: time,
      id: id
   });
   newAction.save();
}

app.post("/newproject", (req, res) => {
   asyncCreation();
   async function asyncCreation() {
      let isAlreadyUsedName = await ProjectData.findOne({ name: req.body.name });
      if (isAlreadyUsedName) { res.send("Oh, no! Someome already used this project name 😔. Try a different one!"); }
      else {
         let projectId = uuidv4();
         let actionId = uuidv4();
         newAction(signedInUser.userCall, "home>create-project", `create>project|#${projectId}`, `Created a project called ${req.body.name}`, new Date(), actionId);
         const newProject = new ProjectData({
            creater: signedInUser.userCall,
            contributors: [signedInUser.userCall],
            description: req.body.about,
            id: projectId,
            name: req.body.name,
            dateCreated: new Date(),
            actions: [actionId]
         });
         newProject.save(function (err, newUser) {
            if (err) return console.error(err);
            else { res.send("Successful creation!"); }
         });
      }
   }
});

/* =============
// New Card
============= */

app.post("/newcard", (req, res) => {
   ProjectData.findOneAndUpdate(
      { name: req.body.projectName }, 
      { $push: { data: {
         status: "to-do",
         subcards: [],
         actions: [],
         contributors: [signedInUser.userCall],
         name: req.body.name,
         about: req.body.about,
         tags: req.body.tags,
         priority: req.body.priority,
         difficulty: req.body.difficulty,
         assignees: req.body.assignees,
         estTime: req.body.estTime,
         dueDate: req.body.dueDate,
         dateCreated: new Date(),
         creator: signedInUser.userCall,
         } } },
         function (err, yay) {
            if (err) { console.log(err); }
            else { console.log("Result:", yay); }
         }
   );
});

/* =============
// Important stuff
============= */

// Get all lost requests
app.get("*", (req, res) => {
   res.render("page-not-found");
});

app.listen(port);





DevData.findOne({ name: "Squirrel", passcode: "0825" }, (err, user) => { signIn(user); });
