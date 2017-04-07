var exec = require('exec');


exec('/etc/init.d/servicio_controler start', function(err, out, code) {
  if (err instanceof Error)
    throw err;
  process.stderr.write(err);
  process.stdout.write(out);
  process.exit(code);
});
