from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
import json
from dbhandler import setup_db, create_job, read_job, update_job, delete_job, ArgumentError

setup_db()

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

class Job(Resource):
    def post(self):
        print(request.get_data())
        job = json.loads(request.get_data())
        if 'id' in job.keys() and job['id'] != None:
            return { 'message': 'job in post request should not include id' }, 400, {'Access-Control-Allow-Origin': '*'} 
        try:
            return create_job(job)
        except ArgumentError as e:
            return { 'message': str(e) }, 400, {'Access-Control-Allow-Origin': '*'} 
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500, {'Access-Control-Allow-Origin': '*'} 

    
    def get(self, name):
        try:
            job = read_job(name)
            if job == None:
                return { 'message': f'Job with name"{name}" was not found'}, 404, {'Access-Control-Allow-Origin': '*'} 
            return job
        except ArgumentError as e:
            return { 'message': str(e) }, 400, {'Access-Control-Allow-Origin': '*'} 
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500, {'Access-Control-Allow-Origin': '*'} 

    def put(self, name=None):
        job = json.loads(request.get_data())
        if name != None:
            job['name'] = None
        try:
            return update_job(job)
        except ArgumentError as e:
            return { 'message': str(e) }, 400, {'Access-Control-Allow-Origin': '*'} 
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500, {'Access-Control-Allow-Origin': '*'} 

    def delete(self, name):
        
        try:
            print(delete_job(name))
            return { 'message': 'success' }, 200, {'Access-Control-Allow-Origin': '*'} 
        except ArgumentError as e:
            return { 'message': str(e) }, 400, {'Access-Control-Allow-Origin': '*'} 
        except Exception as e:
            print(f'{type(e)}: {str(e)}')
            return { 'message': 'something went wrong' }, 500, {'Access-Control-Allow-Origin': '*'} 

api.add_resource(Job, '/job', '/job/<string:name>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='4545', debug=True)