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



// ProjectData.findOneAndUpdate(
//    { name: "Anotherother test" }, 
//    { data: [] },
//    function (error, success) {
//       if (error) { console.log(error); }
//       else { console.log(success + "yayproject"); }
//    }
// );



// GitHub OAuth (for later)
// const clientID = "f928b3838608c37c45b3";
// const clientSecret = "fa6d270ad9590e4ee8b1aa21a68498d19475a1c4"; // I really don't care. Just take it, and enjoy

// app.get("/github-oauth/get", (req, res) => {
//    res.redirect(`https://github.com/login/oauth/authorize?client_id=f928b3838608c37c45b3`);
// });

// app.get("/callback", (req, res) => {
//    axios.post("https://github.com/login/oauth/access_token", {
//       client_id: "f928b3838608c37c45b3",
//       client_secret: "fa6d270ad9590e4ee8b1aa21a68498d19475a1c4",
//       code: req.query.code
//    }, {
//       headers: {
//           Accept: "application/json"
//       }
//    }).then((result) => {
//       console.log(result.data.access_token)
//       res.send("you are authorized " + result.data.access_token)
//    }).catch((err) => {
//       console.log(err);
//    })

//    // Sign into or create an account with GitHub
//    // const requestToken = req.query.code;
//    // axios({
//    //    method: "post",
//    //    url: `https://github.com/login/oauth/access_token?client_id=fa6d270ad9590e4ee8b1aa21a68498d19475a1c4&client_secret=f928b3838608c37c45b3&code=${requestToken}`,
//    //    headers: { accept: "application/json" }
//    // }).then((response) => {
//    //    console.log(response.data[0], response.data.user, response.data.login)
//    //    checkGithub(response.data);
//    //    res.redirect("github-oauth/success");
//    // });
// });

// app.get("/github-oauth/success", function(req, res) {
//    axios({
//       method: "get",
//       url: "https://api.github.com/user",
//       headers: {
//          Authorization: "token " + access_token
//       }
//    }).then((response) => {
//       res.render("github-oauth/success", { userData: response.data });
//    }).catch(function (error) {
//       console.log('Error ' + error.message)
//    });
// });

// async function checkGithub(githubData) {
//    const ID = githubData.id;
//    DevData.findOne({ githubClientId: ID }, (err, data) => {
//       if (err) console.error(err);
//       // console.log(data, githubData, githubData.login);
//    });
//    // if (accountExists) { console.log("no"); signinGithub(ID); }
//    // else { console.log("ys"); createAccountGithub(githubData); }
// }
// function signinGithub(githubId) {
//    DevData.findOne({ githubClientId: githubId }, (err, user) => {
//       if (err) return console.error(err);
//       else { signIn(user); }
//    });
// }
// function createAccountGithub(githubData) {
//    const newUser = new DevData({
//       // username: String,
//       // email: githubData.email,
//       // password: String,
//       // bio: String,
//       // links: [],
//       // dateAccountStarted: Date,
//       // userCall: String,
//       // githubClientId: String,
   
//       userCode: uuidv4(),
//       name: githubData.login,
//       passcode: false,
//       dateAccountStarted: Date.now(),
//       githubClientId: githubData.id
//    });
//    newUser.save(function (err, newUser) { if (err) return console.error(err); });
//    // Send 'em an email
//    sendEmail("🎉 Congratulations! 🎉 You have successfully created your Git Organized account!", "<h2>🎉 Congratulations! 🎉</h2><h4>You have successfully created your Git Organized account!</h4><p>I just wanted to let you know that you created your Git Organized account, and there were no errors in doing so. I will respect the power that I hold with your email and will not send promotional emails unless you want me to. The only other emails I will send shall be triggered by your actions on my site. Good Luck!</p><i>-Editor Rust</i><p>vegetabledash@gmail.com</p>", githubData.email);
// }