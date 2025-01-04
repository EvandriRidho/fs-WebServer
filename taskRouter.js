const express = require('express')

const { TaskController } = require('./taskController')
const taskController = new TaskController()

const taskRouter = express();


taskRouter.get('/', taskController.getAll)
taskRouter.post('/', taskController.create)
taskRouter.put('/:taskId', taskController.update)
taskRouter.delete('/:taskId', taskController.delete)

module.exports = taskRouter