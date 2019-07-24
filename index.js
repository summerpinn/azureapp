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
            return;
        }

        if (!results[0]) {
            console.log("Queue is empty...");
            retMsg = "Queue is empty..."; 
            return;
        }

        results.foreach((result) => {
            console.log("msg : " + result + "\n");
            retMsg += "{" + result + "}"; 
        });
    });
    res.send("msg :" + retMsg ); 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

