/* =============
// Data
============= */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const favicon = require("serve-favicon");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

const saltRounds = 12;

let signedInUser = "(not signed in)";

app.use(favicon(__dirname + "/assets/icon/favicon.ico"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets/"));
app.use("/styles", express.static(__dirname + "/styles/"));
app.use("/scripts", express.static(__dirname + "/scripts/"));
app.set("view engine", "ejs");

// Mongoose things
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }); // DEVCODE

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
   githubClientId: String,
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
app.get("/your-projects", (req, res) => { goSomewhere(res, "projects"); });
app.get("/account", (req, res) => { goSomewhere(res, "account"); });
app.get("/new-project", (req, res) => { goSomewhere(res, "project/create"); });
app.get("/actions-history", (req, res) => { goSomewhere(res, "globalActions"); });

app.get("/:projectname/dashboard", (req, res) => {
   ProjectData.findOne({ name: req.params.projectname }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("lost"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("project/dashboard", returnedData);
         }
      }
   });
});

app.get("/:projectname/edit", (req, res) => {
   ProjectData.findOne({ name: decodeURI(req.params.projectname) }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("lost"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("project/edit", returnedData);
         }
      }
   });
});

app.get("/:projectname/settings", (req, res) => {
   ProjectData.findOne({ name: decodeURI(req.params.projectname) }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("lost"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("project/settings", { user: JSON.stringify(returnedData.user), thisProject: JSON.stringify(project) });
         }
      }
   });
});

app.get("/:projectname/finetune", (req, res) => {
   ProjectData.findOne({ name: decodeURI(req.params.projectname) }, (err, project) => {
      if (err) { console.error(err); }
      else if (project == null) { res.render("lost"); }
      else {
         letsGo();
         async function letsGo() {
            let returnedData = await getNewpageData();
            returnedData.thisProject = project;
            res.render("project/control", { user: JSON.stringify(returnedData.user), project: JSON.stringify(project), thisProject: returnedData.thisProject });
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
app.post("/user/login", (req, res) => {
   DevData.findOne({ username: req.body.name }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.send("There is no account with this name!"); }
      else if (user) {
         bcrypt.compare(req.body.pscd, user.password)
            .catch(err => console.error(err.message))
            .then(match => {
               if (match) { signIn(user); res.send("Success!"); }
               else res.send("Wrong password!");
         });
      }
   });
});

// Signup
app.post("/user/create", (req, res) => {
   asyncCreate();
   async function asyncCreate() {
      let isAlreadyUsedName = await DevData.findOne({ username: req.body.name });
      if (isAlreadyUsedName) { res.send("Choose a different name! (This one is taken!)"); }
      else {
         let isAlreadyUsedEmil = await DevData.findOne({ email: req.body.emil });
         if (isAlreadyUsedEmil) { res.send("This email is already used!"); }
         else {
            bcryptForMe(req.body.pscd).then((passhash) => {
               const newDev = new DevData({
                  username: req.body.name,
                  userCall: req.body.name,
                  email: req.body.emil,
                  password: passhash,
                  bio: "an empty page, filled with endless possibilities",
                  githubClientId: "false"
               });
               newDev.save(function (err) { if (err) return console.error(err); });
               sendEmail(
                  "Hurray! Your Git Organized account has been created!",
                  `<h2>Hurray!</h2>
                  <h4>Your Git Organized account has been created!</h4>
                  <p>I just wanted to let you know that your account (${req.body.name}) has been created. I will not send promotional emails unless you want me to. The only other emails I will send shall be triggered by your actions on my site.</p>
                  <i>Editor Rust :)</i>
                  <p>vegetabledash@gmail.com</p>`,
                  req.body.emil
               );
               // Sign in and go home
               DevData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
                  if (err) return console.error(err);
                  else {
                     console.log(user);
                     signIn(user); res.send("Success!"); }
               });
            })
         }
      }
   }
});

let bcryptForMe = (pass) => {
   return new Promise((resolve) => {
      bcrypt.hash(pass, saltRounds)
      .catch(err => console.error(err.message))
      .then(hash => { resolve(hash); });
   });
}

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
         newProject.save(function (err, newProject) {
            if (err) return console.error(err);
            else { res.send("Successful creation!"); }
         });
      }
   }
});

/* =============
// Control
============= */

app.post("/fetch-project", (req, res) => {
   ProjectData.findById(req.body.project, (err, project) => {
      err ? console.log(err) : res.send(project.data);
   });
});

/* =============
// Cards
============= */

app.post("/newcard", (req, res) => {
   ProjectData.findOneAndUpdate(
      { name: req.body.projectName }, 
      { $push: { data: {
         status: "to-do",
         subcards: [],
         actions: [],
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
         id: uuidv4()
         } } },
         function (err) { err ? console.log(err) : res.send("Successful creation!"); }
   );
});

app.post("/archive-card", (req, res) => {
   ProjectData.findOne({ id: req.body.projectId }, function (err, docs) {
      if (err) { console.log(err); }
      else {
         let thedata = docs.data.find(x => x.id == req.body.cardId);
         ProjectData.findOneAndUpdate( { id: req.body.projectId, "data.id": thedata.id },
         { $set: { "data.$.status": "archived",  } },
         function(err) { err ? console.log(err) : res.send("Successfully archived card!"); });
      }
   });
});

app.post("/un-archive-card", (req, res) => {
   ProjectData.findOne({ id: req.body.projectId }).then(doc => {
      card = doc.data.filter(obj => obj.id == req.body.cardId);
      card[0]["status"] = "to-do";
      const index = doc.data.findIndex(element => {
         if (element.id == req.body.cardId) { return true; }
         return false;
      });
      doc.data[index] = card[0];
      doc.save();
      res.send("Successfully un-archived card!");
   }).catch(err => { console.log(err); });
});

app.post("/delete-card", (req, res) => {
   ProjectData.findOneAndUpdate({ id: req.body.projectId },
      { "$pull": { "data": { "id": req.body.cardId } }},
      { safe: true, multi: true },
      function(err) { if (err) console.log(err); }
   );
});

/* =============
// Mail
============= */

// You've got mail. Wait a second, ok now you do.
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "vegetabledash@gmail.com",
      pass: "rgagablxdefsiymr"
  }
});

function sendEmail(title, text, recipient) {
   var mailOptions = {
      from: "vegetabledash@gmail.com",
      to: recipient,
      subject: title,
      html: text
   };
   
   transporter.sendMail(mailOptions, function(err, info){
      if (err) { console.log(err); }
   });
}

// sendEmail("hey there", "hi", "editorrust@gmail.com"); // Ack private email alert! Whatever. Let me get back to listening to my 10 hour fan sounds (https://www.youtube.com/watch?v=C5Gm8UvxKlU)

/* =============
// Important stuff
============= */

// Get all lost requests
app.get("*", (req, res) => {
   res.render("lost");
});

app.listen(port);

// Auto sign in me
// DevData.findOne({ name: "Editor Squirrel" }, (err, user) => { signIn(user); }); // DEVCODE
