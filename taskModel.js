const { randomUUID } = require('node:crypto');
const { z } = require('zod')

const TASK_STATUS = ["todo", "onprogress", "completed"]

const schemaAddTask = z.object({
    title: z.string().min(3)
}).required()

const schemaUpdateTask = z.object({
    status: z.enum(TASK_STATUS)
}).required()

const schemaTaskId = z.object({
    taskId: z.string().uuid()
})

class TaskModel {
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

    all = () => {
        return this.#tasks
    }

    add = (title) => {
        const newTask = {
            id: randomUUID(),
            title,
            status: "todo"
        }
        this.#tasks.push(newTask)
        return newTask
    }

    removeById = (id) => {
        const target = this.#tasks.find((task) => task.id === id)

        if (target === undefined) {
            return { ok: false, data: null }
        }
        this.#tasks = this.#tasks.filter((task) => task.id !== id)
        return { ok: true, data: target }
    }

    updateStatus = (id, status) => {
        const index = this.#tasks.findIndex((task) => task.id === id);
        if (index < 0) {
            return { ok: false, data: null }
        }
        this.#tasks[index].status = status;
        return { ok: true, data: this.#tasks[index] }
    }
}

module.exports = { TaskModel, schemaAddTask, schemaUpdateTask, schemaTaskId }