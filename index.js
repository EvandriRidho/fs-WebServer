// Import the createServer function
const { createServer, STATUS_CODES } = require('node:http');
const { randomUUID } = require('node:crypto');
const server = createServer();

// Dummy Data
let tasks = [
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

// Membuat Request
server.on("request", (req, res) => {
    const { method, url, headers } = req
    console.debug(method, url, headers.date);

    // Routing
    switch (url) {
        case '/api/v1/tasks':
            switch (method) {
                case 'GET':
                    const getTasks = JSON.stringify(tasks);
                    res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': getTasks.length });
                    res.end(getTasks);
                    return;

                case 'POST':
                    (() => {
                        const body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })

                        req.on('data', (data) => {
                            body.push(data)
                        })

                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { title } = JSON.parse(jsonRaw)

                            if (title === undefined || title.length < 3) {
                                const badRequset = JSON.stringify({ status: STATUS_CODES[400], message: "Title is required and must be grather than 3" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequset.length });
                                res.end(badRequset);
                                return;
                            }

                            const newTask = {
                                id: randomUUID(),
                                title,
                                status: 'todo'
                            }

                            tasks.push(newTask)
                            const newTaskJson = JSON.stringify(newTask)
                            res.writeHead(201, { 'Content-Type': 'application/json', 'content-length': newTaskJson.length });
                            res.end(newTaskJson);
                        })
                    })();
                    return;

                case 'DELETE':
                    (() => {
                        const body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })

                        req.on('data', (data) => {
                            body.push(data)
                        })

                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { id } = JSON.parse(jsonRaw)

                            if (id === undefined) {
                                const badRequset = JSON.stringify({ status: STATUS_CODES[400], message: "Id is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequset.length });
                                res.end(badRequset);
                                return;
                            }

                            const deleteTask = tasks.find((task) => task.id === id)

                            if (deleteTask === undefined) {
                                const notFound = JSON.stringify({ status: STATUS_CODES[404], message: "Task not found" })
                                res.writeHead(404, { 'Content-Type': 'application/json', 'content-length': notFound.length });
                                res.end(notFound);
                                return;
                            }

                            tasks = tasks.filter((task) => task.id !== id)
                            const deleteTaskJson = JSON.stringify(deleteTask)
                            res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': deleteTaskJson.length });
                            res.end(deleteTaskJson);
                        })
                    })();
                    return;
                case 'PUT':
                    (() => {
                        const body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })

                        req.on('data', (data) => {
                            body.push(data)
                        })

                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { id, status } = JSON.parse(jsonRaw)

                            if (id === undefined) {
                                const badRequset = JSON.stringify({ status: STATUS_CODES[400], message: "Id is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequset.length });
                                res.end(badRequset);
                                return;
                            }

                            if (status === undefined) {
                                const badRequset = JSON.stringify({ status: STATUS_CODES[400], message: "Status is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequset.length });
                                res.end(badRequset);
                                return;
                            }

                            const index = tasks.findIndex((task) => task.id === id)

                            if (index < 0) {
                                const notFound = JSON.stringify({ status: STATUS_CODES[404], message: "Task not found" })
                                res.writeHead(404, { 'Content-Type': 'application/json', 'content-length': notFound.length });
                                res.end(notFound);
                                return;
                            }

                            tasks[index].status = status
                            const newEditJson = JSON.stringify(tasks[index])
                            res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': newEditJson.length });
                            res.end(newEditJson);
                        })
                    })();
                    return;
                default:
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: STATUS_CODES[405] }));
                    return;
            }
        default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: STATUS_CODES[404] }));
    }
})

// Membuat Connection
server.on("connection", (socket) => {
    const { remoteAddress, remotePort } = socket;
    console.log(`Connection from ${remoteAddress}:${remotePort}`);
})

// Membuat Close
server.on("close", () => {
    console.log("Server closed successfully!!!");
    process.exit(0);
})

// Membuat Error
server.on("error", (error) => {
    console.error(error);
})

// Membuat Signal
process.on('SIGINT', handleShoutdown);
process.on('SIGTERM', handleShoutdown);

function handleShoutdown(signal) {
    console.log('Shutting down server started', { signal });
    server.close((error) => {
        console.log('Cannot Close Server', { error });
    });
    console.log('Shutting down server completed', { signal });
}

// Membuat Port
const port = process.env.PORT ?? 3000;
server.listen(port, 'localhost', () => {
    console.log(`Server berjalan di http://localhost:${port}`);
})
