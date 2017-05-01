# Simple REST Api Client

Simple client implementation based on [REST Client for Node.js](https://www.npmjs.com/package/node-rest-client).

## Usage

Create config object:
```javascript
const config = {
    api: {
      host: 'http://localhost/api',
      key: 'dev',
      keyHeader: 'X-Api-Key',
      clientOptions: null // https://github.com/aacerox/node-rest-client#options-parameters
    }  
};
```

Create client object:
```javascript
const logger = require('winston'); // or use console object, set null for disable logging
const client = new require('simple-rest-api-client').Client(config, logger);
```

Call the api method:
```javascript
client.request('put', '/foo/${id}', {
    path: {id: '78439bb1-1187-43e8-90f6-708e1182a3d6'},
    data: {test: 'hello'}
});
```
