const express = require("express");
const commit = (process.env.RENDER_GIT_COMMIT || "local").slice(0, 7);
const db = require("./database/db");

const labsRouter = require("./routes/labs");
const codeRouter = require("./routes/code");
const apiRouter = require("./routes/api");
const dsaRouter = require("./routes/dsa");

const app = express();
app.locals.commit = commit;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/labs", labsRouter);
app.use("/code", codeRouter);
app.use("/api", apiRouter);
app.use("/dsa", dsaRouter);

app.get("/", (req, res) => {
    const labCount = db
        .prepare("SELECT COUNT(*) AS count FROM labs")
        .get().count;

    const dsaCount = db
        .prepare("SELECT COUNT(*) AS count FROM dsa_problems")
        .get().count;

    const codeCount = db
        .prepare("SELECT COUNT(*) AS count FROM code_archive")
        .get().count;

    const recentLabs = db
        .prepare(`
            SELECT *
            FROM labs
            ORDER BY created_at DESC
            LIMIT 5
        `)
        .all();

    const recentDsa = db
        .prepare(`
            SELECT *
            FROM dsa_problems
            ORDER BY created_at DESC
            LIMIT 5
        `)
        .all();

    const recentCode = db
        .prepare(`
            SELECT *
            FROM code_archive
            ORDER BY created_at DESC
            LIMIT 5
        `)
        .all();

    res.render("index", {
        labCount,
        dsaCount,
        codeCount,
        recentLabs,
        recentDsa,
        recentCode,
        commit
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;