const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    const {
        search = "",
        subject = "",
        category = "",
        language = ""
    } = req.query;

    let query = `
        SELECT *
        FROM code_archive
        WHERE 1=1
    `;

    const params = [];

    if (search.trim()) {
        query += `
            AND (
                title LIKE ?
                OR subject LIKE ?
                OR category LIKE ?
                OR language LIKE ?
                OR tags LIKE ?
            )
        `;

        const searchTerm = `%${search.trim()}%`;

        params.push(
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        );
    }

    if (subject) {
        query += " AND subject = ?";
        params.push(subject);
    }

    if (category) {
        query += " AND category = ?";
        params.push(category);
    }

    if (language) {
        query += " AND language = ?";
        params.push(language);
    }

    query += " ORDER BY created_at DESC";

    const codeEntries = db
        .prepare(query)
        .all(...params);

    const subjects = db
        .prepare(`
            SELECT DISTINCT subject
            FROM code_archive
            ORDER BY subject
        `)
        .all();

    const categories = db
        .prepare(`
            SELECT DISTINCT category
            FROM code_archive
            ORDER BY category
        `)
        .all();

    const languages = db
        .prepare(`
            SELECT DISTINCT language
            FROM code_archive
            ORDER BY language
        `)
        .all();

    res.render("code", {
        codeEntries,
        subjects,
        categories,
        languages,
        filters: {
            search,
            subject,
            category,
            language
        }
    });
});

router.get("/new", (req, res) => {
    res.render("new-code");
});

// Add code
router.post("/", (req, res) => {
    const {
        title,
        subject,
        category,
        language,
        description,
        code,
        tags
    } = req.body;

    if (!title || !subject || !category || !language) {
        return res
            .status(400)
            .send("Title, subject, category and language are required.");
    }

    db.prepare(`
        INSERT INTO code_archive
        (title, subject, category, language, description, code, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        title,
        subject,
        category,
        language,
        description || "",
        code || "",
        tags || ""
    );

    res.redirect("/code");
});

// Show edit form
router.get("/:id/edit", (req, res) => {
    const entry = db
        .prepare("SELECT * FROM code_archive WHERE id = ?")
        .get(req.params.id);

    if (!entry) {
        return res.status(404).send("Code entry not found.");
    }

    res.render("edit-code", { entry });
});

// Update code
router.post("/:id/edit", (req, res) => {
    const {
        title,
        subject,
        category,
        language,
        description,
        code,
        tags
    } = req.body;

    if (!title || !subject || !category || !language) {
        return res
            .status(400)
            .send("Title, subject, category and language are required.");
    }

    const result = db.prepare(`
        UPDATE code_archive
        SET title = ?,
            subject = ?,
            category = ?,
            language = ?,
            description = ?,
            code = ?,
            tags = ?
        WHERE id = ?
    `).run(
        title,
        subject,
        category,
        language,
        description || "",
        code || "",
        tags || "",
        req.params.id
    );

    if (result.changes === 0) {
        return res.status(404).send("Code entry not found.");
    }

    res.redirect("/code");
});

// Delete code
router.post("/:id/delete", (req, res) => {
    const result = db
        .prepare("DELETE FROM code_archive WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).send("Code entry not found.");
    }

    res.redirect("/code");
});

module.exports = router;