const express = require('express')
const taskRouter = require('./taskRouter')
const morgan = require('morgan')


const app = express()
const logger = morgan(':method :url :status :res[content-length] :res[content-type] - :response-time ms')

app.use(express.json())
app.use(logger)

app.use('/api/v1/tasks', taskRouter)
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Something went wrong!')
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})