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

    #sendJson = (res, data, code) => {
        const getData = JSON.stringify(data)
        res.writeHead(code, { 'Content-Type': 'application/json', 'content-length': getData.length });
        res.end(getData);
    }

    #onData = (req, onendCallback) => {
        let body = [];
        req.on('error', (error) => {
            console.log(error)
        })
        req.on('data', (chunck) => {
            body.push(chunck)
        })
        req.on('end', () => {
            const jsonRaw = Buffer.concat(body).toString();
            const decoded = JSON.parse(jsonRaw)
            onendCallback(decoded)
        })
    }

    // Get
    getAll = (req, res) => {
        this.#sendJson(res, this.#tasks, 200)
        return;
    }

    // Post
    create = (req, res) => {
        this.#onData(req, (data) => {
            const { title } = data
            if (title === undefined || title.length < 3) {
                this.#sendJson(res, ({ status: STATUS_CODES[400], message: "title is required and must be grather than 3" }), 400)
                return;
            }

            const newTask = {
                id: randomUUID(),
                title,
                status: "todo"
            }
            this.#tasks.push(newTask)

            this.#sendJson(res, newTask, 201)
        })
        return;
    }

    // Update
    update = (req, res) => {
        this.#onData(req, (data) => {
            const { id, status } = data
            if (id === undefined) {
                this.#sendJson(res, ({ status: STATUS_CODES[400], message: "id is required" }), 400)
                return;
            }

            if (status === undefined) {
                this.#sendJson(res, ({ status: STATUS_CODES[400], message: "status is required" }), 400)
                return;
            }

            const index = this.#tasks.findIndex((task) => task.id === id);

            if (index < 0) {
                this.#sendJson(res, ({ status: STATUS_CODES[404], message: "Not Found" }), 404)
                return;
            }

            this.#tasks[index].status = status;
            this.#sendJson(res, this.#tasks[index], 200)
        })
        return
    }

    // Delete
    delete = (req, res) => {
        this.#onData(req, (data) => {
            const { id } = data
            if (id === undefined) {
                this.#sendJson(res, ({ status: STATUS_CODES[400], message: "id is required" }), 400)
                return
            }

            const deleteTask = this.#tasks.find((task) => task.id === id)

            if (deleteTask === undefined) {
                this.#sendJson(res, ({ status: STATUS_CODES[404], message: "Not Found" }), 404)
                return
            }

            this.#tasks = this.#tasks.filter((task) => task.id !== id)

            this.#sendJson(res, deleteTask, 200)
        })
    }
}

module.exports = { TaskController }