import React from 'react';
import $ from 'jquery';

// const jobServiceUrl = 'http://localhost:4545/job';

const theQ = 'Render_DoJob';
const theEx = 'MainTopicEx';
let channel;
function connect (params) {
  setTimeout(() => {
    const open = require('amqplib').connect('amqp://localhost');
    open.then((conn) => {
      return conn.createChannel();
    }).then((ch) => {
      channel = ch;
    });
    console.log(`Listening on queue ${theQ}`);
  }, 1);
}

function startJob() {
  console.log($("#uploadBlendFile").val());
  let jobName = $('#newJobName').val();
  $('#actualName').val(jobName);

  channel.checkExchange(theEx).then((err, ok) => {
    return channel.publish(theEx, `jobTask.${jobName}.new`, Buffer.from(jobName));
  });

  checkStatus();
}

function checkStatus() {
  const statusTxt = {
    '-1': 'failed',
    '0': 'created',
    '1': 'uploading files',
    '2': 'received files',
    '3': 'job queued',
    '4': 'job processing',
    '5': 'job finished',
  };
  let jobName = $('#actualName').val();
  const qName = `job${jobName}status`;
  const queueOptions = {
    exclusive: true,
    durable: false,
    autoDelete: true,
  }
  channel.assertQueue(qName, queueOptions).then((err, ok) => {
    return channel.bindQueue(qName, theEx, `job.${jobName}.status`).then((err, ok) => {
      return channel.consume(qName, function(msg) {
          if (msg !== null) {
            const statusCode = msg.content.toString();
            if (statusCode === "0") uploadFile();
            $('#statusLbl').text(statusTxt[statusCode]);
            channel.ack(msg);
          }
      });
    });
  });
}

function uploadFile() {
  let jobId = $('#statusJobName').val();
  const data = new FormData($('#fileUploadForm')[0]);
  // data.append('jobId', uploadBlendFile);
  $.ajax({
      url: `localhost:4441/${jobId}`,
      data: data,
      type: 'PUT',
      // contentType: 'multipart/form-data',
      enctype: 'multipart/form-data',
      contentType: false,
      processData: false,
      cache: false,
      dataType: 'application/json',
      success: function(data) {
        console.log('upload succesful');
        console.log(data);
        // let statusMsg = `Status for ${data.name}: ${statusTxts[data.status]}`
        // $('#statusLbl').text(statusMsg);
        // console.log(statusMsg);
        // console.log(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#statusLbl').text(errorThrown);
      },
      // crossDomain: true,
    });
}

function downloadResult() {
  console.log("downloadResult called")
}


function App() {
  console.log("aaa");
  connect();
  return (
    <div className='App'>
      <span style={{display: 'inline-block'}}>
        <div className='form-group'>
          <div>
            <label htmlFor='newJobName'>Job name (unique)</label>
          </div>
          <div>
            <input id='newJobName' type='text'></input>
          </div>
        </div>
        <div className='form-group' style={{marginTop: '2rem'}}>
          <div>
            <label htmlFor='uploadBlendFile' >Select a .blend file</label>
          </div>
          <div>
            <form method="PUT" id="fileUploadForm">
              <input id='uploadBlendFile' name='blendFile' type='file'></input>
            </form>
          </div>
          <div>
            <input id='startJobBtn' type='button' value='Start job' onClick={startJob}></input>
          </div>
        </div>
      </span>
      <span style={{display: 'inline-block', marginLeft: '4rem'}}>
        <div>
          <label htmlFor='statusJobName'>Job ID to check</label>
        </div>
        <div>
          <input id='statusJobName' type='text'></input>
          <input id='actualName' type='hidden'></input>
        </div>
        <div>
          <input id='checkStatusBtn' type='button' value='Check status' onClick={checkStatus}></input>
          <label id='statusLbl'></label>
        </div>
        <div>
          <input id='downloadBtn' type='button' value='Download' onClick={downloadResult} disabled></input>
        </div>
      </span>
    </div>
  );
}

export default App;
