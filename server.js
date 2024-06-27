const http = require('http')
const app = require('./app')

//creating  a server 
const server = http.createServer(app)

//selecting a port
const port = process.env.port || 3000

//listening requests to the respective port
server.listen(port, () => {
    console.log(`Listening to ${port}`)
})