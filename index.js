const express = require('express')
const taskRouter = require('./taskRouter')
const app = express()

app.use(express.json())
app.use('/api/v1/tasks', taskRouter)


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})