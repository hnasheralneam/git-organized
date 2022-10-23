/* =============
// Data
============= */

const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/assets/"));
app.use("/styles", express.static(__dirname + "/styles/"));
app.set("view engine", "ejs");

/* =============
// Get requests
============= */

app.get("/", (req, res) => { res.render("home"); });
app.get("/pricing", (req, res) => { res.render("pricing"); });
app.get("/docs", (req, res) => { res.render("docs"); });

/* =============
// Important stuff
============= */

// Get all lost requests
app.get("*", (req, res) => {
   res.render("lost");
});

app.listen(port);
