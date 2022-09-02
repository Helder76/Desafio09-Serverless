import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  console.log(userid);

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userid,
      },
    }).promise();


  const todos = response.Items;


  if (!todos) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No ToDo found for user!',
      }),
      headers: { "Content-Type": "application/json" }
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Success",
      todo: todos,
    }),
    headers: { "Content-Type": "application/json" }
  };
};
