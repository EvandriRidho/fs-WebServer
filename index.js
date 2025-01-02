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
                    const getData = JSON.stringify(tasks)
                    res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': getData.length });
                    res.end(getData);
                    return;

                case 'POST':
                    (() => {
                        let body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })
                        req.on('data', (chunck) => {
                            body.push(chunck)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { title } = JSON.parse(jsonRaw)

                            if (title === undefined || title.length < 3) {
                                const badRequest = JSON.stringify({ status: STATUS_CODES[400], message: "title is required and must be grather than 3" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequest.length });
                                res.end(badRequest);
                                return;
                            }

                            const newTask = {
                                id: randomUUID(),
                                title,
                                status: "todo"
                            }

                            tasks.push(newTask)
                            const stringJson = JSON.stringify(newTask)
                            res.writeHead(201, { 'Content-Type': 'application/json', 'content-length': stringJson.length });
                            res.end(stringJson);
                        })
                    })();
                    return;

                case 'PUT':
                    (() => {
                        let body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })
                        req.on('data', (chunck) => {
                            body.push(chunck)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { id, status } = JSON.parse(jsonRaw)

                            if (id === undefined) {
                                const badRequest = JSON.stringify({ status: STATUS_CODES[400], message: "id is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequest.length });
                                res.end(badRequest);
                                return;
                            }

                            if (status === undefined) {
                                const badRequest = JSON.stringify({ status: STATUS_CODES[400], message: "status is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequest.length });
                                res.end(badRequest);
                                return;
                            }

                            const index = tasks.findIndex((task) => task.id === id);

                            if (index < 0) {
                                const notFound = JSON.stringify({ status: STATUS_CODES[404], message: "Not Found" })
                                res.writeHead(404, { 'Content-Type': 'application/json', 'content-length': notFound.length });
                                res.end(notFound);
                                return;
                            }

                            tasks[index].status = status;
                            const stringJson = JSON.stringify(tasks[index])
                            res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': stringJson.length });
                            res.end(stringJson);
                        })
                    })();
                    return;
                case 'DELETE':
                    (() => {
                        let body = [];
                        req.on('error', (error) => {
                            console.log(error)
                        })
                        req.on('data', (chunck) => {
                            body.push(chunck)
                        })
                        req.on('end', () => {
                            const jsonRaw = Buffer.concat(body).toString();
                            const { id } = JSON.parse(jsonRaw)

                            if (id === undefined) {
                                const badRequest = JSON.stringify({ status: STATUS_CODES[400], message: "id is required" })
                                res.writeHead(400, { 'Content-Type': 'application/json', 'content-length': badRequest.length });
                                res.end(badRequest);
                                return
                            }

                            const deleteTask = tasks.find((task) => task.id === id)

                            if (deleteTask === undefined) {
                                const notFound = JSON.stringify({ status: STATUS_CODES[404], message: "not found" })
                                res.writeHead(404, { 'Content-Type': 'application/json', 'content-length': notFound.length });
                                res.end(notFound);
                                return
                            }

                            tasks = tasks.filter((task) => task.id !== id)

                            const stringJson = JSON.stringify(deleteTask)
                            res.writeHead(200, { 'Content-Type': 'application/json', 'content-length': stringJson.length });
                            res.end(stringJson);
                        })
                    })();
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