// Import the createServer function
const { createServer } = require('node:http');
const server = createServer();

const HomePage = `
        <!DOCTYPE html>
            <html lang="en">
                <head>        
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <h1>HomePage</h1>
                </body>
            </html>
    `

const AboutPage = `
        <!DOCTYPE html>
            <html lang="en">
                <head>        
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <h1>AboutPage</h1>
                </body>
            </html>
    `

const NotFoundPage = `
        <!DOCTYPE html>
            <html lang="en">
                <head>        
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <h1>NotFoundPage</h1>
                </body>
            </html>
    `


server.on("request", (req, res) => {
    const { method, url, headers } = req
    console.debug(method, url, headers.host)

    switch (url) {
        case '/home':
            res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': HomePage.length });
            res.end(HomePage);
            return;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': AboutPage.length });
            res.end(AboutPage);
            return;
        default:
            res.writeHead(404, { 'Content-Type': 'text/html', 'Content-Length': NotFoundPage.length });
            res.end(NotFoundPage);
    }
})

server.on("connection", (socket) => {
    const { remoteAddress, remotePort } = socket;
    console.log(`Connection from ${remoteAddress}:${remotePort}`);
})

// Membuat Port
const port = 3000;
server.listen(port, 'localhost', () => {
    console.log(`Server berjalan di http://localhost:${port}`);
})
