const axios = require('axios');
const dotenv=require('dotenv').config()
const { shop,shopify_token} = process.env;

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

module.exports = { getAllSegment};
