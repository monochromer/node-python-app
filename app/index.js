const { Server } = require('http');
const child_process = require('child_process');
const { promisify } = require('util');

const execFile = promisify(child_process.execFile);

const PORT = process.env.PORT || 3000;

const server = new Server();

async function onRequest(req, res) {
  const apps = [
    ['python', ['--version']],
    ['pip', ['--version']],
    ['pyftsubset', ['--help']],
    ['ffmpeg', '-version']
  ];

  Promise.all(apps.map(app => {
    return execFile(...app).then(({ stdout, stderr }) => {
      res.write(stdout, stderr);
      res.write('===\n');
    })
  })
  )
  .then(() => res.end())
  .catch(e => res.end(e.message))
}

server
  .on('request', onRequest)
  .on('error', error => {
    console.error(error)
  })
  .listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
