// Import the createServer function
const { createServer, STATUS_CODES } = require('node:http');
const server = createServer();
const { TaskController } = require('./taskController')

const taskController = new TaskController();

// Membuat Request
server.on("request", (req, res) => {
    const { method, url, headers } = req
    console.debug(method, url, headers.date);

    // Routing
    switch (url) {
        case '/api/v1/tasks':
            switch (method) {
                case 'GET':
                    taskController.getAll(req, res);
                    return;

                case 'POST':
                    taskController.create(req, res);
                    return;

                case 'PUT':
                    taskController.update(req, res);
                    return;
                case 'DELETE':
                    taskController.delete(req, res);
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