const thequeue = 'tasks';
 
const open = require('amqplib').connect('amqp://localhost');
 
// Consumer
open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(thequeue).then(function(ok) {
    return ch.consume(thequeue, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);