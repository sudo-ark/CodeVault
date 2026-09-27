const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    const codeEntries = db
        .prepare("SELECT * FROM code_archive ORDER BY created_at DESC")
        .all();

    res.render("code", { codeEntries });
});

router.get("/new", (req, res) => {
    res.render("new-code");
});

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

module.exports = router;