import mongoose from "mongoose";
import 'dotenv/config';
import supertest from "supertest";
import server from '../server.mjs';


/* Connecting to the database before each test. */
beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.OdysseyTestingDB_URI);
    }
  });

let userId; // Declare userId at the top level
let token; // Store token globally within test file
let odysseyId // Declare odysseyId at the top level

  //logging in a user to get a token and userId for future use
  describe("POST /users/login", () => {
    it("should login a user", async () => {
      const res = await supertest(server).post("/users/login").send({
        email: 'example@gmail.com',
        password: 'example.123',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      //store the user in a global variable for future use
      userId = res.body.user._id;
      token = res.body.token;
    });
  });


  //testing the Odysseys router endpoints...
  // POST method - Create a new odyssey
  describe("POST /odysseys", () => {
    it("should create an odyssey", async () => {
      const res = await supertest(server).post("/odysseys").send({
        title: "example odyssey",
        description: "example description",
        startDate: new Date(),
        endDate: new Date(),
        itinerary: [{ location: "example location", date: new Date() }, { location: "example location", date: new Date() }, { location: "example location", date: new Date() } ],
        banner: "https://example.com/example123",
      }).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('odysseyId');
      expect(res.body).toHaveProperty('odyssey');
      odysseyId = res.body.odysseyId;
    });
  });
  
  // GET method - Retrieve odysseys
  describe("GET /odysseys", () => {
    //scenario 1: Retrieve all odysseys
    it("should return all odysseys", async () => {
      const res = await supertest(server).get("/odysseys").set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odysseys');
    });
    //scenario 2: Retrieve an odyssey by ID
    it("should return an odyssey by ID", async () => {
      const query = { odysseyId: odysseyId };
      const res = await supertest(server).get(`/odysseys`).query(query).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odyssey');
    });
    //scenario 3: Query for odysseys
    it("should return a list of odysseys matching the query", async () => {
      const query = { title: "example odyssey" };
      const res = await supertest(server).get("/odysseys").query(query).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odysseys');
    });
  });
  
  // PUT method - Update an odyssey
  describe("PUT /odysseys/:id", () => {
    it("should update an odyssey", async () => {
      const res = await supertest(server).put(`/odysseys/${odysseyId}`).send({
        title: "new title",
      }).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - Participate in an Odyssey
  describe("POST /odysseys/:id/participate", () => {
    it("should participate in an odyssey", async () => {
      const res = await supertest(server).post(`/odysseys/${odysseyId}/participate`).send({
        userId: userId,
      }).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - unParticipate in an Odyssey
  describe("POST /odysseys/:id/unparticipate", () => {
    it("should unparticipate in an odyssey", async () => {
      const res = await supertest(server).post(`/odysseys/${odysseyId}/unparticipate`).send({
        userId: userId,
      }).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });

  // DELETE method - Delete an odyssey
  describe("DELETE /odysseys/:id", () => {
    it("should delete an odyssey", async () => {
      const res = await supertest(server).delete(`/odysseys/${odysseyId}`).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });



 
  

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.disconnect();
  });