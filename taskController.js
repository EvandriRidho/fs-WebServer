const { randomUUID } = require('node:crypto');
const { STATUS_CODES } = require('node:http');

class TaskController {
    // Dummy data
    #tasks = [
        {
            id: randomUUID(),
            title: 'Belajar NodeJS',
            status: 'onprogress'
        },
        {
            id: randomUUID(),
            title: 'Belajar ReactJS',
            status: 'completed'
        },
        {
            id: randomUUID(),
            title: 'Belajar NextJS',
            status: 'todo'
        },
    ]

    // Get
    getAll = (req, res) => {
        res.json(this.#tasks).status(200)
        return;
    }

    // Post
    create = (req, res) => {
        const { title } = req.body
        if (title === undefined || title.length < 3) {
            res.json({ status: STATUS_CODES[400], message: "title is required and must be at least 3 characters" }).status(400)
            return;
        }

        const newTask = {
            id: randomUUID(),
            title,
            status: "todo"
        }
        this.#tasks.push(newTask)

        res.json(newTask).status(201)
        return;
    }

    // Update
    update = (req, res) => {
        const { status } = req.body
        const { taskId: id } = req.params
        if (id === undefined) {
            res.json({ status: STATUS_CODES[400], message: "id is required" }).status(400)
            return;
        }

        if (status === undefined) {
            res.json({ status: STATUS_CODES[400], message: "status is required" }).status(400)
            return;
        }

        const index = this.#tasks.findIndex((task) => task.id === id);

        if (index < 0) {
            res.json({ status: STATUS_CODES[404], message: "Not Found" }).status(404)
            return;
        }

        this.#tasks[index].status = status;
        res.json(this.#tasks[index]).status(200)
        return
    }

    // Delete
    delete = (req, res) => {
        const { taskId: id } = req.params
        if (id === undefined) {
            res.json({ status: STATUS_CODES[400], message: "id is required" }).status(400)
            return
        }

        const deleteTask = this.#tasks.find((task) => task.id === id)

        if (deleteTask === undefined) {
            res.json({ status: STATUS_CODES[404], message: "Not Found" }).status(404)
            return
        }

        this.#tasks = this.#tasks.filter((task) => task.id !== id)

        res.json(deleteTask).status(200)
    }
}

module.exports = { TaskController }