
#!Flask Modules
from flask import Flask, jsonify,render_template, request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_cors import CORS
from decouple import config


#!Python Modules
from datetime import datetime


#*configution
DEBUG=True

print('Database Url Value ', config("DATABASE_URL"))


#*instantiate the app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config("DATABASE_URL")
db = SQLAlchemy(app)


#*enable CORS
cors = CORS(app, resources={r'/*': {'origins': '*'}})


#--------------------------------------------------------------------------------------------------------------------------


@app.route('/',methods=['GET'])
def pingPongView():
    return {'Ping':'HE'}


if __name__ =='__main__':  
    app.run(debug=True) 
