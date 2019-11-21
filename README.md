# System integration project 2

## Business case
When 3D artists create their art they always depend on strong hardware to perform heavy graphics calculations. There exists various cloud service to do the heavy calculations (so-called Render Farms) but there are not so many which supports the free 3D software Blender. In the spirit of free and easily accesible software I though I would build a prototype for an easy-to-setup render farm that could be deployed with a few simple commands using docker-compose.

## How to setup:
The project is not functional yet but ideally these are the steps you would have to run:

1. Make sure you have docker installed and are able to run docker-compose.
2. Run below command:

        docker-compose up -d

## Enterprise Integration patterns used

In order to decouple the various components of the application I used the Message Oriented Middleware RabbitMQ. With this tool I implemtented following EIPs:

* **Message Broker**

    This one pretty much describes the architecture of the system. All components communicate by publishing messages and consuming queues. The only exception is the file server which uses a REST-like web API to upload and download files.

* **Message Channel**

    This is pretty much implememnted automatically when connecting to RabbitMQ.


Messaging
Messaging Channel
Message Router
Message Broker
Command Message
Event Message


Job status:
- -1 failed
- 0 created
- 1 ready for files
- 2 received files
- 3 job queued
- 4 job processing
- 5 job finished

From job manager:
- job.jobName.created //contains jobId
- job.jobId.renderReady //contains jobid
- job.jobName.status //contains status,jobid

To job manager:
- jobTask.jobName.new //contains name
- jobTask.jobId.status //contains status,jobId


