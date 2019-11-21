# System integration project 2

## Business case
When 3D artists create their art they always depend on strong hardware to perform heavy graphics calculations. There exists various cloud service to do the heavy calculations (so-called Render Farms) but there are not so many which supports the free 3D software Blender. In the spirit of free and easily accesible software I though I would build a prototype for an easy-to-setup render farm that could be deployed with a few simple commands using docker-compose.

## How to setup:
The project is not functional yet but ideally these are the steps you would have to run:

1. Make sure you have docker installed and are able to run docker-compose.
2. Run below command:

        docker-compose up -d

## Enterprise Integration patterns used

![alt text](https://raw.githubusercontent.com/rasmus-bn/System-Integration-Project-2/master/files/DSC_0236_1.JPG)

In order to decouple the various components of the application I used the Message Oriented Middleware RabbitMQ. With this tool I implemtented following EIPs:

* **Message Broker**

    This one pretty much describes the architecture of the system. All components communicate by publishing messages and consuming queues. The only exception is the file server which uses a REST-like web API to upload and download files.

* **Message Channel**

    This is pretty much implemented when using AMQP with RabbitMQ. Every connection from application to RabbitMQ goes through a channel which allows multiple connections with data going in both 'directions'.

* **Message Router**

    In my RabbitMQ i have created an exchange of type 'topic'. This means that the queues binded to the exchange can use a Regex-like pattern to match specific messages.

* **Command Message**

    The Job Handler sends a command to the Render service through RabbitMQ. This command contains a job ID and invokes the processing functionality in the render service.

* **Event Message**

    Whenever the status of a job changes the Job Handler announces the status change with a message containing the job ID and the new status value. Maybe someone is listening, maybe not, but the Job Handler sends them out anyway.



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


