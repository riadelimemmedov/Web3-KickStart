const { createServer } = require('http');
const next = require('next');

const app = next({
    dev:process.env.NODE_ENV !== 'production'
})

const routes = require('./routes.js')
const handler = routes.getRequestHandler(app)//returns a request handler which we can use to parse all HTTP requests.


app.prepare().then(()=>{//It prepare or make the next.js code ready to use another server (In their example express) for handling SSR.
    createServer(handler).listen(3000,(err)=>{
        if(err) throw err;
        console.log('Ready on localhost:3000')
    })
})