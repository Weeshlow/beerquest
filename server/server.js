var http = require('http'),
    httpProxy = require('http-proxy');

var proxy =  httpProxy.createProxyServer({target:'http://api.brewerydb.com:80'});

proxy.on('proxyRes', function(proxyReq, req, res, options) {
    // add the CORS header to the response
    res.setHeader('Access-Control-Allow-Origin', '*');
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
});

proxy.on('error', function(e) {
    console.log('Error: ', e);
});

console.log('Running');

proxy.listen(8080);

console.log('Listening');
