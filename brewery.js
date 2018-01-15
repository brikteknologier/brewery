var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var readConfig = require('general-hammond')('brewery');
var proxy = require('./proxy').bind(null, app);

readConfig(function(config) {
  app.log = require('logginator')('brewery', config.log);
  if (!config.quiet) {
    require("winston-tagged-http-logger")(server, app.log.createSublogger('http'));
  }
  
  // General hammond will automatically read the base config if the "brewery"
  // config wasn't found. Unfortunately some older configs don't specify it,
  // so we have to detect which format we have and go off that.
  const serviceAddress = (service) => config[service].port != null ? `http://localhost:${config[service].port}` : config[service];

  proxy('/integration', serviceAddress('chhaang'));
  proxy('/manage', serviceAddress('sahti'));
  proxy('/auth', serviceAddress('stout'));
  proxy('/api', serviceAddress('kvass'));
  proxy('/upload', serviceAddress('lambic'));
  proxy('', serviceAddress('saison'));

  server.listen(process.env.PORT || 80);
});
