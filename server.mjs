//laying the foundations for the server
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import usersRouter from './routes/Users.mjs';
import eventsRouter from './routes/Events.mjs';
import odysseysRouter from './routes/Odysseys.mjs';

const server = express();
// Use CORS with default settings (allowing all cross-origin requests)
server.use(cors({
  origin: 'https://yourfrontenddomain.com', // Specify your frontend domain
  credentials: true, // Crucial for cookies to be sent with requests from the frontend
}));
// Or configure CORS with options for more control
// server.use(cors({
//   origin: 'https://example.com', // or use an array of origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   // ...other configurations
// }));
server.use(express.json());

//Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 200 requests per windowMs
  });
server.use(apiLimiter);

//Sanitization
server.use(mongoSanitize());

//Additional Headers with Helmet
server.use(helmet());

//establishing the connection with the database
const uri = process.env.OdysseyDB_URI;
const port = process.env.PORT;
mongoose.connect(uri)
    .then((result) => server.listen(port,() => {console.log("listening on localhost: "+port)}))
    .catch((err) => {console.log(err);})

server.use('/users', usersRouter);
server.use('/events', eventsRouter);
server.use('/odysseys', odysseysRouter);

export default server;