
#!Flask Modules
from flask import Flask, jsonify,render_template, request,redirect,url_for,make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_cors import CORS
from decouple import config

import requests



#!Python Modules
from datetime import datetime


#?configution
DEBUG=True

print('Database Url Value ', config("DATABASE_URL"))


#?instantiate the app
app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = config("DATABASE_URL")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/riade/SQLITE/backend.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config.from_object(__name__)
db = SQLAlchemy(app) 

#?enable CORS
cors = CORS(app, resources={r'/*': {'origins': '*'}})


#--------------------------------------------------------------------------------------------------------------------------

#*Block
class Block(db.Model,SerializerMixin):
    __tablename__ = 'block'
    
    id = db.Column('Block Id',db.Integer,primary_key=True)
    blockNumber = db.Column('Block Number',db.String(50),unique=True,nullable=False)
    timeStamp = db.Column('TimeStamp',db.String(30),nullable=False)
    blockMiner = db.Column('Block Miner',db.String(50),nullable=False)
    isComplete = db.Column('Is Complete',db.Boolean,default=False,nullable=False)
    
    def json(self):
        return {'Block Id':self.id,'Block Number':self.blockNumber,'Time Stamp Block':self.timeStamp,'Block Miner':self.blockMiner,'Is Complete':self.isComplete}
    
    

#*Transaction
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



#!createBlock
@app.route('/create/block/<int:block_number>',methods=['POST'])
def createBlock(block_number):
    print('call createa block funtion ', block_number)
    url = "https://api-goerli.etherscan.io/api?module=block&action=getblockreward&blockno={}&apikey={}".format(block_number,config('API_KEY_GEORLI'))
    response = requests.get(url).json()    
    
    timeStamp = datetime.fromtimestamp(int(response['result']['timeStamp'])).strftime('%Y-%d-%m')
    
    new_block = Block(
        blockNumber = response['result']['blockNumber'],
        timeStamp = timeStamp,
        blockMiner = response['result']['blockMiner'],
        isComplete = True if response['status'] == "1" else False 
    )
    db.session.add(new_block)
    db.session.commit()
    return make_response(jsonify({'Message':'Block Created Successfully'},201))



#!createTransaction
@app.route('/create/transaction',methods=['POST'])
def createTransaction():
    try:
        if request.method  == 'POST':
            data = request.get_json()['campaign']
                        
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
            requests.post("http://localhost:5000/create/block/{}".format(data['blockNumber']))
            return make_response(jsonify({'message':'Transaction Created Successfully'},201))
    except:
        return make_response(jsonify({'message': 'Error When Creating Transaction'}),500)




#!getAllTransactions
@app.route('/transactions',methods=['GET'])
def getAllTransactions():
        transactions = Transaction.query.all()
        return make_response(jsonify([transaction.json() for transaction in transactions]),200)


#!getAllBlocks
@app.route('/blocks',methods=['GET'])
def getAllBlocks():
    blocks = Block.query.all()
    return make_response(jsonify([block.json() for block in blocks]),200)




#!deleteTransaction
@app.route('/delete/transaction/<int:transaction_id>',methods=['DELETE'])
def deleteTransaction(transaction_id):
        transaction = Transaction.query.get(transaction_id)
        db.session.delete(transaction)
        db.session.commit()
        return make_response(jsonify({'message':'Transaction Delete Successfully'}),200)


#!deleteBlock
@app.route('/delete/block/<int:block_id>',methods=['DELETE'])
def deleteBlock(block_id):
        block = Block.query.get(block_id)
        db.session.delete(block)
        db.session.commit()
        return make_response(jsonify({'message':'Block Delete Successfully'}),200)


#__name__ == __main__
if __name__ =='__main__':  
    app.run(use_reloader=True)
