const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./backend/db.json'); // Update to point correctly to db.json
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3002;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
