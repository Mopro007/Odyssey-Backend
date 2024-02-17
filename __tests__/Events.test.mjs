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

 

  
  //testing the Events router endpoints...
  // POST method - Create a new event
  describe("POST /events", () => {
    it("should create new event", async () => {
      const res = await supertest(server).post("/events").send({
        title: "example event",
        description: "example description",
        location: "example location",
        starts: new Date(),
        ends: new Date(),
        participants: [userId],
        memories: ["example memory"],
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      //store the id in a global variable for future use
      eventId = res.body.id;
    });
  });
  
  // GET method - Retrieve events
  describe("GET /events", () => {
    //scenario 1: Retrieve all events
    it("should return all events", async () => {
      const res = await supertest(server).get("/events");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('events');
    });
    //scenario 2: Retrieve an event by ID
    it("should return an event by ID", async () => {
      const res = await supertest(server).get(`/events/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('event');
    });
    //scenario 3: Query for events
    it("should return a list of events matching the query", async () => {
      const query = { title: "example event" };
      const res = await supertest(server).get("/events").query(query);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('events');
    });
  });
  
  // PUT method - Update an event
  describe("PUT /events/:id", () => {
    it("should update an event", async () => {
      const res = await supertest(server).put("/events/eventId").send({
        title: "new title",
      });
      expect(res.statusCode).toBe(200);
    });
  });
  
  // DELETE method - Delete an event
  describe("DELETE /events/:id", () => {
    it("should delete an event", async () => {
      const res = await supertest(server).delete("/events/eventId");
      expect(res.statusCode).toBe(200);
    });
  });
  
  // POST method - Participate in an Event
  describe("POST /events/:id/participate", () => {
    it("should participate in an event", async () => {
      const res = await supertest(server).post("/events/eventId/participate").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - unParticipate in an Event
  describe("POST /events/:id/unparticipate", () => {
    it("should unparticipate in an event", async () => {
      const res = await supertest(server).post("/events/eventId/unparticipate").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });
  
  // POST method - Save an Event
  describe("POST /events/:id/saveEvent", () => {
    it("should save an event", async () => {
      const res = await supertest(server).post("/users/userId/saveEvent").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - unSave an Event
  describe("POST /events/:id/unsaveEvent", () => {
    it("should unsave an event", async () => {
      const res = await supertest(server).post("/users/userId/unsaveEvent").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - Join an Event
  describe("POST /events/:id/joinEvent", () => {
    it("should join an event", async () => {
      const res = await supertest(server).post("/users/userId/joinEvent").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - unJoin an Event
  describe("POST /events/:id/unjoinEvent", () => {
    it("should unjoin an event", async () => {
      const res = await supertest(server).post("/users/userId/unjoinEvent").send({
        userId: userId,
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - add a memory to an Event
  describe("POST /events/:id/addMemory", () => {
    it("should add a memory to an event", async () => {
      const res = await supertest(server).post("/events/eventId/addMemory").send({
        memory: "example memory",
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // POST method - remove a memory from an Event
  describe("POST /events/:id/removeMemory", () => {
    it("should remove a memory from an event", async () => {
      const res = await supertest(server).post("/events/eventId/removeMemory").send({
        memory: "example memory",
      });
      expect(res.statusCode).toBe(200);
    });
  });
  




  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.disconnect();
  });