#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
let m = 0;

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'my-microservice';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        channel.assertQueue('multiplyByTwo', {
            autoDelete:  true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel.bindQueue(q.queue, exchange, '');

            channel.consume(q.queue, function(msg) {
                if (msg.content) {
                    console.log("  new  number %s", msg.content.toString());
                    try {
                        m = parseFloat(msg.content.toString())*2;
                        console.log(" Sending new  number %s", m.toString());

                        channel.assertQueue('multiplyByTwoResults',  {
                            autoDelete:  true
                        }, function(error3, qr) {
                            if (error3) {
                                throw error3;
                            }
                            setTimeout(() => channel.sendToQueue(qr.queue, Buffer.from(m.toString())), 5000);
                            console.log(" [x] Sent %s", m.toString());
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});