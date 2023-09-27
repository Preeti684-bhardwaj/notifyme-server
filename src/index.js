const express=require('express')
const app=express();
const dotenv=require('dotenv').config()
const { PORT} = process.env;
const cors=require('cors')
const admin = require('firebase-admin');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

// API route to receive Firebase credentials from frontend
app.post('/api/firebase-credentials', async (req, res) => {
  try {
    const { credentials } = req.body; // Assuming the frontend sends an object with a 'credentials' property
    if (!credentials) {
      return res.status(400).json({ error: 'Credentials are missing in the request.' });
    }

    // Set environment variables with Firebase credentials
    process.env.type = credentials.type;
    process.env.projectId = credentials.project_id;
    process.env.privateKey = credentials.private_key;
    process.env.clientEmail = credentials.client_email;
    process.env.clientId = credentials.client_id;
    process.env.authUri = credentials.auth_uri;
    process.env.tokenUri = credentials.token_uri;
    process.env.authCertUrl = credentials.auth_provider_x509_cert_url;
    process.env.clientCertUrl = credentials.client_x509_cert_url;
    process.env.uniDomain = credentials.universe_domain;

    // Initialize Firebase Admin
    const firebaseConfig = {
      type: process.env.type,
      project_id: process.env.projectId,
      private_key: process.env.privateKey.replace(/\\n/g, '\n'), // Unescape newline characters
      client_email: process.env.clientEmail,
      client_id: process.env.clientId,
      auth_uri: process.env.authUri,
      token_uri: process.env.tokenUri,
      auth_provider_x509_cert_url: process.env.authCertUrl,
      client_x509_cert_url: process.env.clientCertUrl,
      universe_domain: process.env.uniDomain,
    };
console.log(firebaseConfig)
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${process.env.projectId}.firebaseio.com`, // Replace with your Firebase Realtime Database URL
    });

    res.status(200).json({ success: true, message: 'Firebase credentials set and initialized successfully.' });
  } catch (error) {
    console.error('Error setting Firebase credentials:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Route Import
const segmentRoute =require('./routes/segmentRoute')
const shopifyAuthRoute=require("./routes/shopifyAuthRoute")

app.use('/', segmentRoute);
app.use("/", shopifyAuthRoute)

app.get("/")


const server = app.listen(PORT, () => {
    console.log(`connecting to port ${PORT}`)
})


// Unhandled  Promise Rejection ---> mongoDB cluster ERROR
process.on("unhandledRejection" , err => {
    console.log(`Error ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})
