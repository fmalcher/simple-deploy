const http = require('http')  
const exec = require('child_process').exec;
const port = 2525;

const scriptMap = require('./scripts.json');

const requestHandler = (req, res) => {  
  let parts = req.url.split('/');

  let body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    
    if(parts[1] === 'deploy') {
      let key = parts[2];
      return handleDeploy(res, key, body);
    }

    res.end('No action');
  });
}


const handleDeploy = (res, key, bodyJson) => {
  if(scriptMap.hasOwnProperty(key)) {
    let { branch, script } = scriptMap[key];

    let body = JSON.parse(bodyJson);
    let destBranch = body.ref.split('/').slice(-1)[0];

    if(destBranch === branch) {
      exec(script, (error, stdout, stderr) => {
        
        if(error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(error));
          return;
        }

        let output = [];
        output.push(stdout);
        output.push(stderr);

        res.end(output.join('\n'));

      });

    } else {
      res.end('Nothing to do here');
    }

  } else {
    res.end('Invalid command');
  }
}



const server = http.createServer(requestHandler);

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`)
})