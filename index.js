var azure = require('azure-storage');
const express = require('express');
var config = require('./config');

const app = express();
const queueService = azure.createQueueService(config.azureStorageAccount, config.azureStorageAccessKey);
const port=process.env.PORT || 3000; 

function readMessage() { 
    return new Promise(function(resolve, reject){

        var ret = ""; 
        
        queueService.getMessages(config.queueName, (err, results, res) => {
            if(err){
                resolve(err);
            }

            results.forEach(element => {
                ret += element.messageText; 
            }); 

            resolve(ret); 
        }); 
    })
}

app.get('/', (req, res) => {
    res.send("Hi"); 
})

app.get('/message', (req, res) => {
    
    readMessage().then( (message)=>{ 
        var ret = message;
        res.send("msg : " +  JSON.stringify(ret) ); 
    }); 
    
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

