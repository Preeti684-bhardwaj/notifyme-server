const axios = require('axios');
const dotenv=require('dotenv').config()
const { shop,shopify_token} = process.env;
// const admin = require('firebase-admin');
const { getMessaging }=require ("firebase/messaging/sw");

const getAllSegment = async (req, res) => {
  try {
    // Your Shopify store's GraphQL endpoint and API access token
    const shopifyGraphQLEndpoint = `https://${process.env.shop}/admin/api/2023-04/graphql.json`;
    console.log(process.env.shop)
    const shopifyApiAccessToken = process.env.shopify_token;
    console.log(process.env.shopify_token)

    // Define your GraphQL query
    // we are only getting the data of first 10 products if we want get all the data we need modify the query

    const graphqlQuery = `
    {
        segments(first: 10) {
          edges {
            node {
              creationDate
              id
              lastEditDate
              name
              query
            }
          }
        }
      }
      
    `;

    // Set up the Axios request config
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyApiAccessToken,
      },
    };

    // Send the GraphQL query request using Axios
    const response = await axios.post(shopifyGraphQLEndpoint, { query: graphqlQuery }, axiosConfig);
    // console.log(response)
    // Process the response data
    const segments = response.data.data.segments.edges.map((edge) => edge.node);
    // console.log('segments:', segments);

    // Send the segments data as a JSON response
    res.status(200).json({ success: true, segments });
  } catch (error) {
    console.error('Error:', error);
    // Handle the error and send an appropriate response
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, body, segments,id } = req.body;

    // Prepare the notification message
    const notificationMessage = {
  notification: {
    title: title,
    body: body,
  },
  topic: segments,
  segmentId:id,
};

    // Initialize Firebase Messaging
    // const messaging = admin.messaging();

    if (!Array.isArray(segments) || segments.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid segments provided.' });
    }

    console.log(notificationMessage);
    // Send notifications to each segment and delete topics
    const sendPromises = segments.map(async (segment) => {
      try {
        // Modify the segment (topic) name to ensure it's valid
        const sanitizedSegment = segment.replace(/\s+/g, '_').toLowerCase();
        console.log(sanitizedSegment);

        // Send the message to the sanitized topic (segment)
        await getMessaging().send({
          ...notificationMessage,
          topic: sanitizedSegment,
        });

        // Delete the topic after sending the notification
        await getMessaging().deleteTopic(sanitizedSegment);

        console.log(`Notification sent to topic and topic "${sanitizedSegment}" deleted.`);
      } catch (error) {
        console.error(`Error sending notification to topic "${segment}":`, error);
      }
    });

    // Wait for all notifications to be sent and topics to be deleted
    await Promise.all(sendPromises);

    res.status(200).json({ success: true, message: 'Notifications sent and topics deleted successfully.' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getAllSegment,sendNotification};
