import React from 'react';
import $ from 'jquery';

const jobServiceUrl = 'http://localhost:4545/job';

function startJob() {
  console.log($("#uploadBlendFile").val());
  let jobName = $('#newJobName').val();
  $.ajax({
    accepts: 'application/json',
    url: jobServiceUrl,
    type: 'POST',
    data:{ 'name': jobName, 'fileId': "asdasdasd", 'status': 0 },
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#statusLbl').text(errorThrown);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
    crossDomain: true,
  });
}

function checkStatus() {
  let jobName = $('#statusJobName').val();
  $.ajax({
    url: `${jobServiceUrl}/${jobName}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'json',
    success: function(data) {
      let statusTxts = [
        'Initiated',
        'Waiting to process',
        'Done',
        'Cancelled'
      ]
      let statusMsg = `Status for ${data.name}: ${statusTxts[data.status]}`
      $('#statusLbl').text(statusMsg);
      console.log(statusMsg);
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#statusLbl').text(errorThrown);
    },
    crossDomain: true,
  });
}

function downloadResult() {
  console.log("downloadResult called")
}


function App() {
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
            <input id='uploadBlendFile' type='file'></input>
          </div>
          <div>
            <input id='startJobBtn' type='button' value='Start job' onClick={startJob}></input>
          </div>
        </div>
      </span>
      <span style={{display: 'inline-block', marginLeft: '4rem'}}>
        <div>
          <label htmlFor='statusJobName'>Job to check</label>
        </div>
        <div>
          <input id='statusJobName' type='text'></input>
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
