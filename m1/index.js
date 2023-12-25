#!/usr/bin/env node

const express = require('express');
const app = express();
const port=3000;

const amqp = require('amqplib/callback_api');

app.use(express.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.post("/multiplyByTwo", (req, res) => {
  if (typeof req.body.number !== 'number') {
    console.error("incorrect request:  value for number must contains number type");
    res.status(400).send(JSON.stringify(
      {error: "incorrect request:  value for number must contains number type" }
    ));

  } else {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }

          let queue = 'multiplyByTwo';
          let msg = req.body.number.toString();

          channel.assertQueue(queue, {
            durable: true,
            autoDelete: true
          });
          channel.sendToQueue(queue, Buffer.from(msg));

          console.log(" [x] Sent %s", msg);
          let queueResuls = 'multiplyByTwoResults';
          channel.assertQueue(queueResuls,  {
            autoDelete:  true
          }, function(error3, qr) {
            if (error3) {
                throw error3;  
            }
            channel.consume(qr.queue, (msgResult) => {
              if (msgResult.content) {
                console.log('recelved from results queue: ', msgResult.content.toString());
                res.status(200).send(JSON.stringify({number: msgResult.content.toString()}));    
                channel.close();          
              }
            });
        });
        
          
        }),
        setTimeout(function() {
          connection.close();
        }, 5100);
    });  
  }
});


app.listen(port, () => {console.log('started on port ', port);});
