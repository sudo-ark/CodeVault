const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Display lab experiments with search and filters
router.get("/", (req, res) => {
    const {
        search = "",
        subject = "",
        status = ""
    } = req.query;

    let query = `
        SELECT *
        FROM labs
        WHERE 1=1
    `;

    const params = [];

    if (search.trim()) {
        query += `
            AND (
                CAST(experiment_no AS TEXT) LIKE ?
                OR title LIKE ?
                OR subject LIKE ?
            )
        `;

        const searchTerm = `%${search.trim()}%`;

        params.push(
            searchTerm,
            searchTerm,
            searchTerm
        );
    }

    if (subject) {
        query += " AND subject = ?";
        params.push(subject);
    }

    if (status === "completed") {
        query += " AND completed = 1";
    } else if (status === "pending") {
        query += " AND completed = 0";
    }

    query += " ORDER BY experiment_no";

    const labs = db.prepare(query).all(...params);

    const subjects = db.prepare(`
        SELECT DISTINCT subject
        FROM labs
        ORDER BY subject
    `).all();

    res.render("labs", {
        labs,
        subjects,
        filters: {
            search,
            subject,
            status
        }
    });
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

    if (!experiment_no || !title || !subject || !aim) {
        return res
            .status(400)
            .send("Experiment number, title, subject and aim are required.");
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

// Mark a lab experiment as completed
router.post("/:id/complete", (req, res) => {
    const lab = db
        .prepare("SELECT completed FROM labs WHERE id = ?")
        .get(req.params.id);

    if (!lab) {
        return res.status(404).send("Experiment not found.");
    }

    const newStatus = lab.completed ? 0 : 1;

    db.prepare(`
        UPDATE labs
        SET completed = ?
        WHERE id = ?
    `).run(newStatus, req.params.id);

    res.redirect("/labs");
});

// Show edit form
router.get("/:id/edit", (req, res) => {
    const lab = db
        .prepare("SELECT * FROM labs WHERE id = ?")
        .get(req.params.id);

    if (!lab) {
        return res.status(404).send("Experiment not found.");
    }

    res.render("edit-lab", { lab });
});

// Update an experiment
router.post("/:id/edit", (req, res) => {
    const {
        experiment_no,
        title,
        subject,
        aim,
        theory,
        code,
        output
    } = req.body;

    if (!experiment_no || !title || !subject || !aim) {
        return res
            .status(400)
            .send("Experiment number, title, subject and aim are required.");
    }

    db.prepare(`
        UPDATE labs
        SET experiment_no = ?,
            title = ?,
            subject = ?,
            aim = ?,
            theory = ?,
            code = ?,
            output = ?
        WHERE id = ?
    `).run(
        experiment_no,
        title,
        subject,
        aim,
        theory || "",
        code || "",
        output || "",
        req.params.id
    );

    res.redirect("/labs");
});

// Delete an experiment
router.post("/:id/delete", (req, res) => {
    const result = db
        .prepare("DELETE FROM labs WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).send("Experiment not found.");
    }

    res.redirect("/labs");
});

module.exports = router;