const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Display all lab experiments
router.get("/", (req, res) => {
    const labs = db
        .prepare("SELECT * FROM labs ORDER BY experiment_no")
        .all();

    res.render("labs", { labs });
});

// Show the add experiment form
router.get("/new", (req, res) => {
    res.render("new-lab");
});

// Add a new experiment
router.post("/", (req, res) => {
    const {
        experiment_no,
        title,
        subject,
        aim,
        theory,
        code,
        output
    } = req.body;

    // Basic validation
    if (!experiment_no || !title || !subject || !aim) {
        return res.status(400).send("Experiment number, title, subject and aim are required.");
    }

    const insert = db.prepare(`
        INSERT INTO labs
        (experiment_no, title, subject, aim, theory, code, output)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
        experiment_no,
        title,
        subject,
        aim,
        theory || "",
        code || "",
        output || ""
    );

    res.redirect("/labs");
});

module.exports = router;