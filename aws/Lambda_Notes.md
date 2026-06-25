# AWS Lambda - DisasterTrain360 AI

## Service

AWS Lambda

## Function Name

disastertrain360-training-processor

## Runtime

Java 21

## Status

Successfully Created and Tested

## Test Event

{
"trainingId": "TR001",
"district": "Madurai"
}

## Test Response

{
"body": "Hello from Lambda!",
"statusCode": 200
}

## Purpose

This Lambda function will be triggered after a training is created.

Future Flow:

Training Created
↓
Lambda Trigger
↓
Training Processing
↓
Preparedness Analysis
↓
AI Insight Generation

