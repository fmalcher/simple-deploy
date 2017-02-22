const http = require('http')  
const exec = require('child_process').exec;
const port = 2525;

const scriptMap = require('./scripts.json');

const requestHandler = (request, response) => {  
  let parts = request.url.split('/');

  if(parts[1] === 'deploy') {
      let key = parts[2];
      if(scriptMap.hasOwnProperty(key)) {
          let script = scriptMap[key];
          console.log(script);
          exec(script, () => {});
      }
  }

  response.end('OK');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`)
})