FROM python:3

WORKDIR /usr/src/app
COPY . .

RUN pip install flask
RUN pip install flask-restful
RUN pip install -U flask-cors
RUN pip install pika

CMD ["python", "jobserver.py"]
