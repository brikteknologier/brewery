var request = require('request');
var _ = require('underscore');
var url = require('url');

module.exports = function(app, from, to) {
  var endpoint = url.parse(to);
  var expr = "^" + from + "((/.*)?)$";
  app.all(new RegExp(expr), function(req, res) {
    var url = _.clone(endpoint);
    url.path = req.url;

    var apiRequest = request({
      url: url,
      method: req.method,
      headers: req.headers,
      followRedirect: false
    }, function(err, apiResponse) {
      if (err) {
        app.log.error("Couldn't contact " + to + " - " + err.code);
        req.socket.destroy();
        return;
      }
      res.statusCode = apiResponse.statusCode;
      res.headers = apiResponse.headers;
    });

    req.pipe(apiRequest).pipe(res);
  });
};
