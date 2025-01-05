const express = require('express')
const { TaskModel } = require('./taskModel')
const { TaskController } = require('./taskController')

const taskModel = new TaskModel()
const taskController = new TaskController(taskModel)

const taskRouter = express();


taskRouter.get('/', taskController.getAll)
taskRouter.post('/', taskController.create)
taskRouter.put('/:taskId', taskController.update)
taskRouter.delete('/:taskId', taskController.delete)

module.exports = taskRouter