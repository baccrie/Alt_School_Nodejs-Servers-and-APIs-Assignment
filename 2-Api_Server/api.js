const fs = require("fs");
const path = require("path");
const http = require("http");

const items = path.join(__dirname, "items.json");

const port = 8000;

function requestHandler(req, res) {
  if (req.url === "/items" && req.method === "POST") {
    postItem(req, res);
  }

  if (req.url === "/items" && req.method === "GET") {
    getAllItems(req, res);
  }

  if (req.url.startsWith("/items/") && req.method === "GET") {
    grab_one(req, res);
  }

  if (req.url.startsWith("/items/") && req.method === "PATCH") {
    updateItem(req, res);
  }

  if (req.url.startsWith("/items/") && req.method === "DELETE") {
    deleteItem(req, res);
  }
}

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server has started running at http://localhost:${port}`);
});


//Error Functions

function client_error(){
  res.writeHead("404");
  res.end("item not found");
}

function server_error(){
  res.writeHead("500");
  res.end("internal server error");
}


//Create An item
function postItem(req, res) {
  const info = fs.readFileSync(items)
  const  itemsArrayOfObj = JSON.parse(info)

  const body = [];
  req.on("data", (details) => {
    body.push(details);
  });

  req.on("end", () => {
    const parsed_items = Buffer.concat(body).toString();
    const to_create = JSON.parse(parsed_items);

    itemsArrayOfObj.push({
      ...to_create,
      id: Math.floor(Math.random() * 500).toString(),
    });

    fs.writeFile(items, JSON.stringify(itemsArrayOfObj), (err) => {
      if (err) {
       server_error()
      }

      res.end(JSON.stringify(to_create));
    });
  });
}

//Get all Items
function getAllItems(req, res) {
  fs.readFile(items, "utf8", (err, data) => {
    if (err) {
     server_error()
    }
    res.end(data);
  });
}

//Get one item
function grab_one(req, res) {
  const id = req.url.split("/")[2];
  const items = fs.readFileSync(items);
  const itemsArrayOfObj = JSON.parse(items);

  const index = itemsArrayOfObj.findIndex((item) => {
    return item.id === id;
  });
  if (index === -1) {
    client_error()
  }
  res.end(JSON.stringify(itemsArrayOfObj[index]));
}

//Update Item
function updateItem(req, res) {
  const id = req.url.split("/")[2];

  const items = fs.readFileSync(items);
  const itemsArrayOfObj = JSON.parse(items);

  const body = [];
  req.on("data", (details) => {
    body.push(details);
  });

  req.on("end", () => {
    const parsed_items = Buffer.concat(body).toString();
    const update = JSON.parse(parsed_items);

    const index = itemsArrayOfObj.findIndex((item) => {
      return item.id === id;
    });

    if (index == -1) {
      res.end(`item not found`);
    }

    itemsArrayOfObj[index] = { ...itemsArrayOfObj[index], ...update };

    fs.writeFile(items, JSON.stringify(itemsArrayOfObj), (err) => {
      if (err) {
        server_error()
      }
      res.end(JSON.stringify(itemsArrayOfObj[index]));
    });
  });
}

//Delete a particular item
function deleteItem(req, res) {
  const id = req.url.split("/")[2];

  const items = fs.readFileSync(items);
  const itemsArrayOfObj = JSON.parse(items);

  const index = itemsArrayOfObj.findIndex((item) => {
    return item.id === id;
  });

  if (index == -1) {
    res.end(`item not found`);
  }

  itemsArrayOfObj.splice(index, 1);

  fs.writeFile(items, JSON.stringify(itemsArrayOfObj), (err) => {
    if (err) {
      server_error()
    }

    res.end(`item deleted`);
  });
}
