// allowed is an array of allowed hosts
// readyCb is an optional function that will be called
// once all host names have been resolved
module.exports = function(allowed, readyCb) {
  // Resolve all domains
  var ips = [];
  var remaining = allowed.length;
  allowed.forEach(function(host) {
    if(/^[.0-9]+$/.test(host)) {
      // Should be an IP address
      ips.push(host);
      remaining--;
      if(!remaining && readyCb) readyCb();
    } else {
      // Resolve the host name
      // Adapt this if you want IPv6 support
      require('dns').resolve(host, 'A', function(err, addresses) {
        remaining--;
        if(!err) {
          addresses.forEach(function(ip) { ips.push(ip); });
        } else {
          // Handle the error, either using an additional callback
          // or by collecting all errors and submitting them to
          // readyCb
        }
        if(!remaining && readyCb) readyCb();
      });
    }
  });
  return function(req, res, next) {
    var clientIp = req.ip;
    // Check if the address is allowed
    if(ips.indexOf(clientIp) == -1) {
      res.end(403, 'Remote host is not allowed to use the API');
    } else {
      next();
    }
  };
};