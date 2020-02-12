const server = require("./server")
const port = 3001

server.listen(port, () => console.log(`Fake server listening on port ${port}!`))
