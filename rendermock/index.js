let channel;
const theQ = 'Render_DoJob';
const theEx = 'MainTopicEx';

setTimeout(() => {
    const open = require('amqplib').connect('amqp://rabbitmq-service');
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
    console.log(`Listening on queue ${theQ}`);
}, 60000);


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