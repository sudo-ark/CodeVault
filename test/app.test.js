const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../app");

test("GET /health returns status ok", async () => {
    const response = await request(app)
        .get("/health");

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.status, "ok");
});

test("POST /labs adds a valid experiment", async () => {
    const response = await request(app)
        .post("/labs")
        .send({
            experiment_no: 999,
            title: "Automated Test Experiment",
            subject: "Testing",
            aim: "Test adding a valid laboratory experiment",
            theory: "Testing theory",
            code: "console.log('test');",
            output: "Test successful"
        });

    assert.strictEqual(response.statusCode, 302);
    assert.strictEqual(response.headers.location, "/labs");
});

test("POST /labs rejects invalid input", async () => {
    const response = await request(app)
        .post("/labs")
        .send({
            experiment_no: 999,
            title: "",
            subject: "",
            aim: ""
        });

    assert.strictEqual(response.statusCode, 400);
});