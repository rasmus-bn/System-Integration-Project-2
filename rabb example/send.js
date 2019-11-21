const thequeue = 'tasks';
 
const open = require('amqplib').connect('amqp://localhost');
 
// Publisher
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  // return ch.assertQueue(thequeue).then((ok) => {
    return ch.sendToQueue('Render_DoJob', Buffer.from('something'));
  // });
}).catch(console.warn);