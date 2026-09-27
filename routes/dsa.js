const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Display all DSA problems
router.get("/", (req, res) => {
    const problems = db
        .prepare("SELECT * FROM dsa_problems ORDER BY created_at DESC")
        .all();

    res.render("dsa", { problems });
});

// Show add problem form
router.get("/new", (req, res) => {
    res.render("new-dsa");
});

// Add a new DSA problem
router.post("/", (req, res) => {
    const {
        title,
        topic,
        difficulty,
        platform,
        language,
        approach,
        solution,
        time_complexity,
        space_complexity
    } = req.body;

    if (!title || !topic || !difficulty) {
        return res
            .status(400)
            .send("Title, topic and difficulty are required.");
    }

    db.prepare(`
        INSERT INTO dsa_problems
        (
            title,
            topic,
            difficulty,
            platform,
            language,
            approach,
            solution,
            time_complexity,
            space_complexity
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        title,
        topic,
        difficulty,
        platform || "",
        language || "",
        approach || "",
        solution || "",
        time_complexity || "",
        space_complexity || ""
    );

    res.redirect("/dsa");
});

// Toggle solved status
router.post("/:id/complete", (req, res) => {
    const problem = db
        .prepare("SELECT solved FROM dsa_problems WHERE id = ?")
        .get(req.params.id);

    if (!problem) {
        return res.status(404).send("Problem not found.");
    }

    const newStatus = problem.solved ? 0 : 1;

    db.prepare(`
        UPDATE dsa_problems
        SET solved = ?
        WHERE id = ?
    `).run(newStatus, req.params.id);

    res.redirect("/dsa");
});

module.exports = router;