
#!Flask Modules
from flask import Flask, jsonify,render_template, request,redirect,url_for,make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_cors import CORS
from decouple import config

import requests



#!Python Modules
from datetime import datetime


#*configution
DEBUG=True

print('Database Url Value ', config("DATABASE_URL"))


#*instantiate the app
app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = config("DATABASE_URL")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/riade/SQLITE/backend.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config.from_object(__name__)
db = SQLAlchemy(app) 

#*enable CORS
cors = CORS(app, resources={r'/*': {'origins': '*'}})


#--------------------------------------------------------------------------------------------------------------------------

class Block(db.Model,SerializerMixin):
    __tablename__ = 'block'
    
    id = db.Column('Block Id',db.Integer,primary_key=True)
    blockNumber = db.Column('Block Number',db.String(50),unique=True,nullable=False)
    timeStamp = db.Column('TimeStamp',db.String(30),nullable=False)
    blockMiner = db.Column('Block Miner',db.String(50),nullable=False)
    isComplete = db.Column('Is Complete',db.Boolean,default=False,nullable=False)
    
    def json(self):
        return {'Block Id':self.id,'Block Number':self.blockNumber,'Time Stamp Block':self.timeStamp,'Block Miner':self.blockMiner,'Is Complete':self.isComplete}
    
    

class Transaction(db.Model,SerializerMixin):
    
    __tablename__ = 'transaction'
    
    id = db.Column('Transaction Id',db.Integer,primary_key=True)
    blockHash = db.Column('Block Hash',db.String(100),nullable=False)
    fromUser = db.Column('From User',db.String(100),nullable=False)
    toUser = db.Column('To User',db.String(100),nullable=False)
    transactionHash = db.Column('Transaction Hash',db.String(100),nullable=False)
    transactionIndex = db.Column('Transaction Index',db.String(100),nullable=False)
    gasFees = db.Column('Gass Fees',db.String(100),nullable=False)
    
    def json(self):
        return {'Transaction Id':self.id,'Transaction Hash':self.blockHash,'From User':self.fromUser,'To User':self.toUser,
                'Transaction Hash':self.transactionHash,'Transaction Index':self.transactionIndex,'GasFees':self.gasFees}


with app.app_context():
    db.create_all()

@app.route('/',methods=['GET'])
def pingPongView():
    return {'Ping':'Pong'}


def createBlock(blockNumber):
    url = "https://api-goerli.etherscan.io/api?module=block&action=getblockreward&blockno={}&apikey={}".format(blockNumber,config('API_KEY_GEORLI'))
    print('Result Url ', url)
    response = requests.get(url).json()
    
    print('sene noldue ', response)
    
    new_block = Block(
        blockNumber = response["blockNumber"],
        timeStamp = datetime.fromtimestamp(response["timeStamp"]).strftime('%Y-%d-%m'),
        blockMiner = response['blockMiner'],
        isComplete = True if response['status'] == "1" else False 
    )
    db.session.add(new_block)
    db.session.commit()
    print('Ne verdi bas ', new_block)
    return make_response(jsonify({'Transaction Created Successfully':new_block},201))


#!createTransaction
@app.route('/create/transaction',methods=['POST'])
def createTransaction():
    try:
        if request.method  == 'POST':
            data = request.get_json()['campaign']
            
            print('Data Value ', data)
            
            new_transactions = Transaction(
                blockHash=data['blockHash'],
                fromUser=data['from'],
                toUser=data['to'],
                transactionHash=data['transactionHash'],
                transactionIndex=data['transactionIndex'],
                gasFees=data['gasUsed']
            ) 
            db.session.add(new_transactions)
            db.session.commit()
            print('Block Number Value ', data['blockNumber'])
            createBlock(data['blockNumber'])
            return make_response(jsonify({'message':'Transaction Created Successfully'},201))
    except:
        return make_response(jsonify({'message': 'Error Transaction Creating'}), 500)


#!getAllTransactions
@app.route('/transactions',methods=['GET'])
def getAllTransactions():
        transactions = Transaction.query.all()
        blocks = Block.query.all()
        print('Transaction ', transactions)
        print('noldu')
        return make_response(jsonify([transaction.json() for transaction in transactions]),200)


if __name__ =='__main__':  
    app.run(debug=True)
