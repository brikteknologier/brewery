var request = require('request');
var _ = require('underscore');

module.exports = function(app, from, to) {
  var expr = "^" + from + "((/.*)?)$";
  app.all(new RegExp(expr), function(req, res) {
    var apiRequest = request({
      url: new URL(req.url, to),
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
