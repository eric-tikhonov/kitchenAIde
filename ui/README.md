# Todo App
This Todo App is a full-stack application leveraging AWS Lambda for backend operations and AWS Amplify for frontend deployment. The app allows users to manage their tasks efficiently, using a serverless architecture for scalability and ease of use.

## Overview
**Backend:**

AWS Lambda: Hosts the backend logic, encapsulated in a zip file containing the api folder.

Express: Handles HTTP requests.

DynamoDB: Stores and retrieves tasks via CRUD operations in ```task.js```.

**Frontend:**

React: UI components for managing tasks.

AWS Amplify: Automates deployment, hosting, and integration of the frontend.

## Project Structure

```
├── api
│   ├── index.js     # Express backend
│   ├── task.js      # DynamoDB client and CRUD operations
├── ui
│   ├── src
|   |   ├── components/  # React components
|   |   ├── App.js       # React secondary root
│   |   ├── index.css    # Styling
│   |   ├── index.js     # React root
│   |   ├── utils.js     # Store lambda url
│   ├── package.json     # Dependencies
```

## Deployment
**Backend Deployment (AWS Lambda)**
Zip the api Folder:

Ensure index.js and task.js are included in the zip file.

**Upload to AWS Lambda:**

Create a new Lambda function.

Upload the zip file.

Set up the Lambda handler to point to index.handler.

**Environment Variables:**

Configure environment variables for DynamoDB connection.

**Frontend Deployment (AWS Amplify)**
Connect to GitHub:

Point AWS Amplify to the ui folder in your GitHub repository.

**Configure Build Settings:**

Amplify detects the build settings from the package.json in the ui folder.

**Deploy:**

Amplify deploys the React app and provides a URL for access.

## Usage
**Access the App:**

Navigate to the URL provided by Amplify to use the Todo App.

**Manage Tasks:**

Add, update, delete, and view tasks seamlessly through the intuitive UI.

AWS Services Used
AWS Lambda: For serverless backend operations.

AWS DynamoDB: NoSQL database for storing tasks.

AWS Amplify: Simplifies deployment and hosting of the frontend.
