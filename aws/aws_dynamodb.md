AWS DynamoDB - DisasterTrain360 AI
Service

AWS DynamoDB

Region

ap-south-1 (Mumbai)

Status

Successfully Created and Connected with Spring Boot Backend

Tables Created
Users

Partition Key: userId

Trainings

Partition Key: trainingId

Reports

Partition Key: reportId

Notifications

Partition Key: notificationId

Insights

Partition Key: insightId

Enrollments

Partition Key: enrollmentId

Test Data

Training Record:

{
  "trainingId": "TR001",
  "trainingName": "Flood Preparedness Training",
  "district": "Madurai",
  "participants": 150,
  "status": "Completed"
}
Purpose

AWS DynamoDB is used as the primary NoSQL database for storing and managing all DisasterTrain360 AI application data, including users, trainings, reports, notifications, insights, and enrollments.

Future Flow

User Registration

↓

Users Table

↓

Training Creation

↓

Trainings Table

↓

Enrollment Process

↓

Enrollments Table

↓

Preparedness Analysis

↓

Insights Table

↓

Reports & Notifications

↓

Reports Table / Notifications Table
