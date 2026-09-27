const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Return all DSA problems as JSON
router.get("/dsa", (req, res) => {
    const problems = db
        .prepare(`
            SELECT
                id,
                title,
                topic,
                difficulty,
                platform,
                language,
                approach,
                time_complexity,
                space_complexity,
                solved,
                created_at
            FROM dsa_problems
            ORDER BY created_at DESC
        `)
        .all();

    res.json(problems);
});

module.exports = router;