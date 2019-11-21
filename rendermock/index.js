const $ = require('jquery');

const open = require('amqplib').connect('amqp://localhost');
let channel;
const theQ = 'Render_DoJob';
const theEx = 'MainTopicEx';

open.then((conn) => {
    return conn.createChannel();
}).then((ch) => {
    channel = ch;
    return ch.checkQueue(theQ).then(function(ok) {
        return ch.consume(theQ, function(msg) {
            if (msg !== null) {
            console.log(msg.content);
            const jobId = msg.content.toString();
            doRender(jobId, msg)
            channel.ack(msg);
            }
        });
    });
});

function doRender(jobId, msg) {
    console.log('doRender');
    channel.checkExchange(theEx).then((err, ok) => {
        return channel.publish(theEx, `jobTask.${jobId}.status`, Buffer.from('3'));
    });

    setTimeout(() => {
        channel.checkExchange(theEx).then((err, ok) => {
            
            return channel.publish(theEx, `jobTask.${jobId}.status`, Buffer.from('3'));
        });
    }, 2000);
}

console.log(`Listening on queue ${theQ}`);
