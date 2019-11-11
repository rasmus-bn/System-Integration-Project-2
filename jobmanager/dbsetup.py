import sqlite3

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
print('DB created')