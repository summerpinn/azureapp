var azure = require('azure-storage');
const express = require('express');
var config = require('./config');

const app = express();
const queueService = azure.createQueueService(config.azureStorageAccount, config.azureStorageAccessKey);
const port = process.env.PORT || 3000;

function readMessage() {
    return new Promise(function (resolve, reject) {
        queueService.getMessages(config.queueName, (err, messages, res) => {
            
            if (err) {
                reject(err);
                return;
            }

            var message = messages[0];
            queueService.deleteMessage(config.queueName, message.messageId, message.popReceipt,
                (error) => {
                    if (!error) {
                        // Message deleted
                    }
                }
            );

            resolve(message.messageText);
        });
    })
}

app.get('/', (req, res) => {
    res.send("Hello");
})

app.get('/read', (req, res) => {
    readMessage().then((message) => {
        res.send("msg : " + message);
    });
})

app.listen(port, () => console.log(`Azure Node Application listening on port ${port}!`))

