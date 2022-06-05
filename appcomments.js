// DevData.findOneAndUpdate(
//    { _id: "62378bfb529354830979f954" }, 
//    // { $push: { actions: summat } },
//    // { actions: ["414fd23c-b4ce-4668-bab1-8bf9831869b1"]  },
//    { projects: ["be23290f-7d37-4046-bd4f-0cbddb4dc448"]  },
//    function (error, success) {
//       if (error) { console.log(error); }
//       else { console.log(success + "yayayayay"); }
//    }
// );



// const newAction = new ActionData({
//    userCall: "squirrel", // userCall of action do-er
//    location: "home>projects",
//    type: `create>project|#be23290f-7d37-4046-bd4f-0cbddb4dc448`,
//    text: "Created a project called Test Project",
//    // would be like `Created {project} called {name}`
//    time: Date.now(),
//    id: summat
// });
// newAction.save(function (err, data) {
//    if (err) { return console.error(err); } 
//    else { console.log(data + "yayaction" ); }
// });

// ProjectData.findOneAndUpdate(
//    { _id: "62378ea1bec8667b456885a4" }, 
//    { $push: { actions: "414fd23c-b4ce-4668-bab1-8bf9831869b1" } },
//    function (error, success) {
//       if (error) { console.log(error); }
//       else { console.log(success + "yayproject"); }
//    }
// );



// format like
// type: `create>${card}|projectID=parentcardID+parentcardID#cardID`,
// cardID basically item id


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




// ProjectData.findByIdAndDelete("62378fef65ad7e3382672738", function (err, docs) {
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
