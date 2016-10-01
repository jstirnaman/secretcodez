/*jshint node:true*/

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

const bodyParser = require('body-parser');

module.exports = function(app) {
  var globSync   = require('glob').sync;
  var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  // Log proxy requests
  var morgan  = require('morgan');
  app.use(morgan('dev'));

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/api/codes', function (req, res) {
    if (req.headers['authorization'] !== "Bearer some bs") {
      return res.status(401).send('Unauthorized');
    }

    return res.status(200).send({
      codes: [
        { id: 1, description: 'Secret code #1 is: super-secret-code1' },
        { id: 2, description: 'Secret code #2 is: super-secret-code2' }
      ]
    });
  });
};
