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

 

let userId; // Declare userId at the top level
let token; // Store token globally within test file
let odysseyId; // Declare odysseyId at the top level
let eventId; // Declare eventId at the top level



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
  //creating an odyssey to use in the event tests
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

  
  //testing the Events router endpoints...
  // POST method - Create a new event
  describe("POST /events", () => {
    it("should create new event", async () => {
      const res = await supertest(server)
      .post("/events")
      .send({
        event:{
        title: "example event",
        description: "example description",
        location: "example location",
        starts: new Date(),
        ends: new Date(),
        participants: [userId,],
        organizers: [userId,],
        odyssey: odysseyId
      },
      userId: userId,
      odysseyId: odysseyId
    })
    .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('eventId');
      expect(res.body).toHaveProperty('event');
      //store the id in a global variable for future use
      eventId = res.body.eventId;
    });
  });
  
  // GET method - Retrieve events
  describe("GET /events", () => {
    //scenario 1: Retrieve all events
    it("should return all events", async () => {
      const res = await supertest(server).get("/events").set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('events');
    });
    //scenario 2: Retrieve an event by ID
    it("should return an event by ID", async () => {
      const res = await supertest(server)
      .get("/events")
      .query({ eventId: eventId })
      .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('event');
    });
    //scenario 3: Query for events
    it("should return a list of events matching the query", async () => {
      const res = await supertest(server)
      .get("/events")
      .query({ title: "example event" })
      .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('events');
    });
  });
  
  // PUT method - Update an event
  describe("PUT /events/:id", () => {
    it("should update an event", async () => {
      const res = await supertest(server)
      .put(`/events/${eventId}`)
      .send({ title: "new title"})
      .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('updatedEvent');
    });
  });

  // POST method - Join an Event
  describe("POST /events/:id/join", () => {
      it("should join an event", async () => {
        const res = await supertest(server)
        .post(`/events/${eventId}/join`)
        .send({ userId: userId })
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('updatedEvent');
      });
  });
  
  // POST method - unJoin an Event
  describe("POST /events/:id/unjoin", () => {
      it("should unjoin an event", async () => {
        const res = await supertest(server)
        .post(`/events/${eventId}/unjoin`)
        .send({ userId: userId })
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('updatedEvent');
      });
  });
  
  // // POST method - Save an Event
  // describe("POST /events/:id/saveEvent", () => {
  //   it("should save an event", async () => {
  //     const res = await supertest(server).post("/users/userId/saveEvent").send({
  //       userId: userId,
  //     });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });

  // // POST method - unSave an Event
  // describe("POST /events/:id/unsaveEvent", () => {
  //   it("should unsave an event", async () => {
  //     const res = await supertest(server).post("/users/userId/unsaveEvent").send({
  //       userId: userId,
  //     });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });

  // // POST method - add a memory to an Event
  // describe("POST /events/:id/addMemory", () => {
  //   it("should add a memory to an event", async () => {
  //     const res = await supertest(server).post("/events/eventId/addMemory").send({
  //       memory: "example memory",
  //     });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });

  // // POST method - remove a memory from an Event
  // describe("POST /events/:id/removeMemory", () => {
  //   it("should remove a memory from an event", async () => {
  //     const res = await supertest(server).post("/events/eventId/removeMemory").send({
  //       memory: "example memory",
  //     });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });

  // DELETE method - Delete an event
  describe("DELETE /events/:id", () => {
    it("should delete an event", async () => {
      const res = await supertest(server)
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });
  




  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.disconnect();
  });