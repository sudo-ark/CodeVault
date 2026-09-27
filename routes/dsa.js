const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Display DSA problems with search and filters
router.get("/", (req, res) => {
    const {
        search = "",
        topic = "",
        difficulty = "",
        status = ""
    } = req.query;

    let query = "SELECT * FROM dsa_problems WHERE 1=1";
    const params = [];

    if (search.trim()) {
        query += `
            AND (
                title LIKE ?
                OR topic LIKE ?
                OR platform LIKE ?
                OR language LIKE ?
            )
        `;

        const searchTerm = `%${search.trim()}%`;

        params.push(
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        );
    }

    if (topic) {
        query += " AND topic = ?";
        params.push(topic);
    }

    if (difficulty) {
        query += " AND difficulty = ?";
        params.push(difficulty);
    }

    if (status === "solved") {
        query += " AND solved = 1";
    } else if (status === "unsolved") {
        query += " AND solved = 0";
    }

    query += " ORDER BY created_at DESC";

    const problems = db.prepare(query).all(...params);

    const topics = db
        .prepare("SELECT DISTINCT topic FROM dsa_problems ORDER BY topic")
        .all();

    const difficulties = db
        .prepare("SELECT DISTINCT difficulty FROM dsa_problems ORDER BY difficulty")
        .all();

    res.render("dsa", {
        problems,
        topics,
        difficulties,
        filters: {
            search,
            topic,
            difficulty,
            status
        }
    });
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

// Show edit form
router.get("/:id/edit", (req, res) => {
    const problem = db
        .prepare("SELECT * FROM dsa_problems WHERE id = ?")
        .get(req.params.id);

    if (!problem) {
        return res.status(404).send("Problem not found.");
    }

    res.render("edit-dsa", { problem });
});

// Update a DSA problem
router.post("/:id/edit", (req, res) => {
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

    const result = db.prepare(`
        UPDATE dsa_problems
        SET title = ?,
            topic = ?,
            difficulty = ?,
            platform = ?,
            language = ?,
            approach = ?,
            solution = ?,
            time_complexity = ?,
            space_complexity = ?
        WHERE id = ?
    `).run(
        title,
        topic,
        difficulty,
        platform || "",
        language || "",
        approach || "",
        solution || "",
        time_complexity || "",
        space_complexity || "",
        req.params.id
    );

    if (result.changes === 0) {
        return res.status(404).send("Problem not found.");
    }

    res.redirect("/dsa");
});

// Delete a DSA problem
router.post("/:id/delete", (req, res) => {
    const result = db
        .prepare("DELETE FROM dsa_problems WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).send("Problem not found.");
    }

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