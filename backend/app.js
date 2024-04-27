const express = require("express");

const app = express();
const port = 8081;

app.use(express.json());
app.use(require("cors")());

let tasks = [
    {
        id: 1,
        taskName: "Laundry",
        status: "TODO",
    },
    {
        id: 2,
        taskName: "Cleaning",
        status: "DONE",
    },
];

app.get("/hello", (req, res) => {
    res.send("Hi Dev");
});

// Getting tasks
app.get("/task", (req, res) => {
    res.json(tasks);
});

// adding a task
app.post("/task", (req, res) => {
    newTask = req.body;
    tasks.push({ ...newTask, id: Date.now().toString() });
    res.send("Task Added Successfully");
});

// GET,POST , DELETE , PUT

app.listen(port, (err) => {
    console.log("app is running on port :" + port);
});
