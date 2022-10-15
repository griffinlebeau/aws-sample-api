const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const awsConfig = {
  region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';
router.get('/users', (req, res) => {
    const params = {
      TableName: table,
    };
    // Scan return all items in the table
    dynamodb.scan(params, (err, data) => {
      if (err) {
        res.status(500).json(err); // an error occurred
      } else {
        res.json(data.Items);
      }
    });
  });

router.get('/users/:username', (req, res) => {
    const params = {
        TableName: table,
        KeyConditionExpression: '#un = :user', //specifies the search criteria, like WHERE clause in SQL
        ExpressionAttributeNames: {//define attribute aliases
          '#un': 'username',
          '#ca': 'createdAt',
          '#th': 'thought',
          "#img": "image"
        },
        ExpressionAttributeValues: {//define value aliases
          ':user': req.params.username,
        },
        ProjectionExpression: '#th, #ca',//determines which attributes or columns will be returned, similar to SELECT in SQL
        ScanIndexForward: false, //default setting is true, which specifies the order for the sort key, which will be ascending (false is descending)
      };
      dynamodb.query(params, (err, data) => {
        if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          res.status(500).json(err); // an error occurred
        } else {
          console.log("Query succeeded.");
          res.json(data.Items)
        }
      });
    }); // closes the route for router.get(users/:username)

// Create new user
router.post('/users', (req, res) => {
    const params = {
      TableName: table,
      Item: {
        username: req.body.username,
        createdAt: Date.now(),
        thought: req.body.thought,
        image: req.body.image
      },
    };
    dynamodb.put(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to add item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
        res.status(500).json(err); // an error occurred
      } else {
        console.log('Added item:', JSON.stringify(data, null, 2));
        res.json({ Added: JSON.stringify(data, null, 2) });
      }
    });
  });
module.exports = router;