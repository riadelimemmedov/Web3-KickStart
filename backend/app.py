
#!Flask Modules
from flask import Flask, jsonify,render_template, request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_cors import CORS


#!Python Modules
from datetime import datetime


#*configution
DEBUG=True


#*instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)


#*enable CORS
cors = CORS(app, resources={r'/*': {'origins': '*'}})


#--------------------------------------------------------------------------------------------------------------------------


@app.route('/',methods=['GET'])
def pingPongView():
    return {'Ping':'Pong'}


if __name__ =='__main__':  
    app.run(debug=True) 
