// Import express
const express = require('express')

// Import taskController
const { TaskController } = require('./taskController')
const taskController = new TaskController()

// Init express
const app = express()

// Middleware
app.use(express.json())
// Routes
app.get('/api/v1/tasks', taskController.getAll)
app.post('/api/v1/tasks', taskController.create)
app.put('/api/v1/tasks', taskController.update)
app.delete('/api/v1/tasks', taskController.delete)

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})