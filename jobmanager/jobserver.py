from flask import Flask, request
from flask_restful import Resource, Api
import json
from dbhandler import create_job, read_job, update_job, delete_job, ArgumentError

app = Flask(__name__)
api = Api(app)

class Job(Resource):
    def post(self):
        job = json.loads(request.get_data())
        if 'id' in job.keys() and job['id'] != None:
            return { 'message': 'job in post request should not include id' }, 400
        try:
            return create_job(job)
        except ArgumentError as e:
            return { 'message': str(e) }, 400
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500

    def get(self, name):
        try:
            job = read_job(name)
            if job == None:
                return { 'message': f'Job with name"{name}" was not found'}, 404
            return job
        except ArgumentError as e:
            return { 'message': str(e) }, 400
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500

    def put(self, name=None):
        job = json.loads(request.get_data())
        if name != None:
            job['name'] = None
        try:
            return update_job(job)
        except ArgumentError as e:
            return { 'message': str(e) }, 400
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500

    def delete(self, name):
        
        try:
            print(delete_job(name))
            return { 'message': 'success' }, 200
        except ArgumentError as e:
            return { 'message': str(e) }, 400
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500

api.add_resource(Job, '/job', '/job/<string:name>')

if __name__ == '__main__':
    app.run(debug=True)