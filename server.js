const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.SITE_PASSWORD || '';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // Basic auth if password set
  if (PASSWORD) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="axis-explorer"' });
      return res.end('Unauthorized');
    }
    const decoded = Buffer.from(auth.slice(6), 'base64').toString();
    if (decoded !== `:${PASSWORD}` && decoded !== `admin:${PASSWORD}`) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="axis-explorer"' });
      return res.end('Unauthorized');
    }
  }

  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Axis Explorer running on http://localhost:${PORT}`);
});
