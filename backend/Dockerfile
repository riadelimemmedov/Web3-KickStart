#!pull official base image
FROM python:3.10.7-slim-buster


#!set works directory
WORKDIR /riade/OneDrive/Desktop/flask_react_web3/backend


#!set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


#!copy whole project to your docker home directory
COPY requirements.txt ./


#!run this command to install all dependencies
RUN pip install -r requirements.txt


#!copy root folder
COPY . /riade/OneDrive/Desktop/flask_react_web3/backend/
