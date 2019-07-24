var azure = require('azure-storage');
const express = require('express');
var config = require('./config');
const queueService = azure.createQueueService(config.azureStorageAccount, config.azureStorageAccessKey);

const app = express();
const port=process.env.PORT || 3000; 

app.get('/', (req, res) => {
    res.send("Hi"); 
})

app.get('/message', (req, res) => {
    console.log(`[Queue - Receiver] Truncating Queue`);
    var retMsg = ""; 
    queueService.getMessage(config.queueName, (err, results, res) => {
        if (err) {
            console.log(err);
            retMsg = err; 
        }else if (!results[0]) {
            console.log("Queue is empty...");
            retMsg = "Queue is empty..."; 
        }else {
            for( var i = 0; i<results.lenght; i++ ){

            }
        }
    });
    res.send("msg :" + retMsg ); 
})

app.get('/add', (req, res) => {
    queueService.createMessage(config.queueName, "Hi from Node", function(error, results, response){
        if(!error){
          // Message inserted
        }
      }); 
      res.send("message added." ); 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

