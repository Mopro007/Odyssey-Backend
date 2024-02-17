import mongoose from "mongoose";
import 'dotenv/config';
import supertest from "supertest";
import server from '../server.mjs';

// const request = supertest(server);

/* Connecting to the database before each test. */
beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.OdysseyDB_URI);
    }
  });

  



  //testing the Odysseys router endpoints...
  // POST method - Create a new odyssey
  describe("POST /odysseys", () => {
    it("should create an odyssey", async () => {
      const res = await supertest(server).post("/odysseys").send({
        title: "example odyssey",
        description: "example description",
        itinerary: [{ location: "example location", date: new Date() }],
        banner: "https://example.com/example123",
        participants: [userId],
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      //store the id in a global variable for future use
      odysseyId = res.body.id;
    });
  });
  
  // GET method - Retrieve odysseys
  describe("GET /odysseys", () => {
    //scenario 1: Retrieve all odysseys
    it("should return all odysseys", async () => {
      const res = await supertest(server).get("/odysseys");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odysseys');
    });
    //scenario 2: Retrieve an odyssey by ID
    it("should return an odyssey by ID", async () => {
      const res = await supertest(server).get(`/odysseys/${odysseyId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odyssey');
    });
    //scenario 3: Query for odysseys
    it("should return a list of odysseys matching the query", async () => {
      // Define a query, e.g., search for odysseys with a specific property
      const query = { title: "example odyssey" };
      const res = await supertest(server).get("/odysseys").query(query);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('odysseys');
    });
  });
  
  // PUT method - Update an odyssey
  describe("PUT /odysseys/:id", () => {
    it("should update an odyssey", async () => {
      const res = await supertest(server).put("/odysseys/odysseyId").send({
        title: "new title",
      });
      expect(res.statusCode).toBe(200);
    });
  });
  
  // DELETE method - Delete an odyssey
  describe("DELETE /odysseys/:id", () => {
    it("should delete an odyssey", async () => {
      const res = await supertest(server).delete("/odysseys/odysseyId");
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - Participate in an Odyssey
  describe("POST /odysseys/:id/participate", () => {
    it("should participate in an odyssey", async () => {
      const res = await supertest(server).post("/odysseys/odysseyId/participate").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - unParticipate in an Odyssey
  describe("POST /odysseys/:id/unparticipate", () => {
    it("should unparticipate in an odyssey", async () => {
      const res = await supertest(server).post("/odysseys/odysseyId/unparticipate").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });



 
  

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.disconnect();
  });