const express = require('express')
const { TaskModel, schemaAddTask, schemaUpdateTask, schemaTaskId } = require('./taskModel')
const { TaskController } = require('./taskController')
const { ZodError } = require('zod')

const taskModel = new TaskModel()
const taskController = new TaskController(taskModel)

const taskRouter = express();


taskRouter.get('/', taskController.getAll)
taskRouter.post('/', withValidator(schemaAddTask), taskController.create)
taskRouter.put('/:taskId', withValidator(schemaUpdateTask), withValidator(schemaTaskId, true), taskController.update)
taskRouter.delete('/:taskId', withValidator(schemaTaskId, true), taskController.delete)

// Middleware
function withValidator(schema, isParams = false) {
    return (req, res, next) => {
        try {
            if (isParams) {
                schema.parse(req.params)
            } else {
                schema.parse(req.body)
            }
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.errors.map(({ path, message }) => ({ path, message }))
                res.json({ status: 400, issues }).status(400)
            } else {
                next(error)
            }
        }
    }
}

module.exports = taskRouter