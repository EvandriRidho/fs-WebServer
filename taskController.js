const { randomUUID } = require('node:crypto');
const { STATUS_CODES } = require('node:http');
const { TaskModel } = require('./taskModel');

class TaskController {
    #repo
    constructor(taskModel) {
        this.#repo = taskModel
    }
    getAll = (req, res) => {
        res.json(this.#repo.all()).status(200)
        return;
    }

    create = (req, res) => {
        const { title } = req.body
        if (title === undefined || title.length < 3) {
            res.json({ status: STATUS_CODES[400], message: "title is required and must be at least 3 characters" }).status(400)
            return;
        }

        const newTask = this.#repo.add(title)

        res.json(newTask).status(201)
        return;
    }

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

        const { ok, data } = this.#repo.updateStatus(id, status)

        if (!ok) {
            res.json({ status: STATUS_CODES[404], message: "Not Found" }).status(404)
            return;
        }
        res.json(data).status(200)
        return
    }

    delete = (req, res) => {
        const { taskId: id } = req.params
        if (id === undefined) {
            res.json({ status: STATUS_CODES[400], message: "id is required" }).status(400)
            return
        }

        const { ok, data } = this.#repo.removeById(id)

        if (!ok) {
            res.json({ status: STATUS_CODES[404], message: "Not Found" }).status(404)
            return
        }

        res.json(data).status(200)
    }
}

module.exports = { TaskController }