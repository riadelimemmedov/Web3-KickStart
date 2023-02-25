const routes = require('next-routes')()

routes
    .add('/campaigns/new','/campaigns/new')
    .add('/campaigns/:address','/campaigns/show')//key value pair,if user get campaigns/some_network_adress/ this url dowland campaigns/show.js component
    .add('/campaigns/:address/requests','campaigns/requests/index')
    .add('/campaigns/:address/requests/new','campaigns/requests/new')


module.exports = routes 