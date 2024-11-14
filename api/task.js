import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchTasks = async () => {
  const command = new ScanCommand({
    ExpressionAttributeNames: { "#name": "name" },
    ProjectionExpression: "id, #name, completed, createdAt",
    TableName: "Tasks",
  });

  const response = await docClient.send(command);

  return response;
};

export const createTasks = async ({ name, completed }) => {
  const uuid = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const command = new PutCommand({
    TableName: "Tasks",
    Item: {
      id: uuid,
      name,
      completed,
      createdAt,
    },
  });

  const response = await docClient.send(command);

  return response;
};

export const updateTasks = async ({ id, name, completed, createdAt }) => {
  const command = new UpdateCommand({
    TableName: "Tasks",
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      "#name": "name",
    },
    UpdateExpression: "set #name = :n, completed = :c, createdAt = :ca",
    ExpressionAttributeValues: {
      ":n": name,
      ":c": completed,
      ":ca": createdAt,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);

  return response;
};

export const deleteTasks = async (id) => {
  const command = new DeleteCommand({
    TableName: "Tasks",
    Key: {
      id,
    },
  });

  const response = await docClient.send(command);

  return response;
};
