// Import Neccessary Module
const path = require("path");
const fs = require("fs");
const http = require("http");

// Functions that handles webpages
function get_page(req, res) {
  res.setHeader("content-type", "text/html");
  res.writeHead(200);
  res.end(fs.readFileSync(server_path));
}

function getReq_webpage(req, res) {
  const file = req.url.split("/")[1];
  const actualPath = path.join(__dirname, file);
  const web = fs.readFileSync(actualPath);
  res.setHeader("content-type", "text/html");
  res.writeHead(200);
  res.end(web);
}

function error_page(req, res) {
  res.setHeader("content-type", "text/html");
  res.writeHead(404);
  res.end(fs.readFileSync(error_end));
}


const server_path = path.join(__dirname, "index.html");
const error_end = path.join(__dirname, "404.html");

const port = 8000;

function request_intercept(req, res) {
  if (req.url === "/") {
    get_page(req, res);
  }

  if (req.url.endsWith(".html") && req.method === "GET") {
    try {
      getReq_webpage(req, res);
    } catch (error) {
      error_page(req, res);
    }
  }
}

const server = http.createServer(request_intercept);

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});




