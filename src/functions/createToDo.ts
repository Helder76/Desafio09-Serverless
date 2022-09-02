import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateToDo {
  title: string;
  deadline: string;
}

interface ITemplate {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
console.log('teste');
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

  const { userid } = event.pathParameters;
  const id = uuidV4();

  const todo: ITemplate = {
    id: String(id),
    user_id: userid,
    title,
    done: false,
    deadline: new Date(deadline).toISOString()
  }

  await document.put({
    TableName: "todos",
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "ToDo created!",
      todo: todo,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}