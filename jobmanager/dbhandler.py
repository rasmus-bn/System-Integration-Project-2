import sqlite3

class ArgumentError(Exception):
    pass

def setup_db():
    conn = sqlite3.connect('jobsdb.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    print(cursor.execute('''
    create table if not exists jobs (
        id integer primary key, 
        name text not null unique, 
        fileId text unique,
        status integer not null
    )
    '''))
    conn.commit()
    conn.close()
    print('DB created')

def db_connect():
    conn = sqlite3.connect('jobsdb.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    return cursor, conn

def job_from_row(row):
    return {
        'id': row['id'],
        'name': row['name'],
        'fileId': row['fileId'],
        'status': row['status'],
    }

def create_job(job):
    if 'name' not in job.keys() or job['name'] == None or job['name'] == '':
        raise ArgumentError("Provided job name is None or empty")
    conn = None
    try:
        cursor, conn = db_connect()
        print('before dbex')
        cursor.execute(
            'insert into jobs (name, fileId, status) values (?, ?, ?)', 
            (job['name'], job['fileId'], job['status'])
        )
        print('after dbex')

        conn.commit()
        cursor.execute('select * from jobs where name=? limit 1', (job['name'],))
        row = cursor.fetchone()
        return job_from_row(row)
    except sqlite3.IntegrityError as e:
        print(f'{type(e)}: {str(e)}')
        raise ArgumentError('A value provided was invalid')
    finally:
        if conn != None:
            conn.close()

def read_job(job_name):
    if job_name == None or job_name == '':
        raise ArgumentError("Provided job name is None or empty")
    conn = None
    try:
        cursor, conn = db_connect()
        cursor.execute('select * from jobs where name=? limit 1', (job_name,))
        row = cursor.fetchone()
        print(row)
        if row == None:
            return None
        print(row)
        return job_from_row(row)
    except sqlite3.IntegrityError as e:
        print(f'{type(e)}: {str(e)}')
        raise ArgumentError('A value provided was invalid')
    finally:
        if conn != None:
            conn.close()

def update_job(job):
    if 'name' not in job.keys() or job['name'] == None or job['name'] == '':
        raise ArgumentError("Provided job name is None or empty")
    conn = None
    try:
        cursor, conn = db_connect()
        cursor.execute(
            'update jobs set name=?, fileId=?, status=? where name =?', 
            (job['name'], job['fileId'], job['status'], job['name'])
        )
        conn.commit()
        cursor.execute('select * from jobs where name=? limit 1', (job['name'],))
        row = cursor.fetchone()
        return job_from_row(row)
    except sqlite3.IntegrityError as e:
        print(f'{type(e)}: {str(e)}')
        raise ArgumentError('A value provided was invalid')
    finally:
        if conn != None:
            conn.close()

def delete_job(job_name):
    if job_name == None or job_name == '':
        raise ArgumentError("Provided job name is None or empty")
    conn = None
    try:
        cursor, conn = db_connect()
        cursor.execute(
            'update jobs set status=? where name =?', 
            (-1, job_name)
        )
        conn.commit()
        cursor.execute('select * from jobs where name=? limit 1', (job_name,))
        row = cursor.fetchone()
        return job_from_row(row)
    except sqlite3.IntegrityError as e:
        print(f'{type(e)}: {str(e)}')
        raise ArgumentError('A value provided was invalid')
    finally:
        if conn != None:
            conn.close()