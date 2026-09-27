const express = require("express");
const db = require("./database/db");
const labsRouter = require("./routes/labs");
const codeRouter = require("./routes/code");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/labs", labsRouter);
app.use("/code", codeRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`CodeVault running on port ${PORT}`);
});