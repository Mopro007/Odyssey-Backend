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

  //testing the Users router endpoints...
  //testing the GET /users/test endpoint
  describe("GET /users/test", () => {
    it("should return a test message", async () => {
      const res = await supertest(server).get("/users/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Hello World!");
    });
  });

  //testing the POST /users create new user endpoint
  describe("POST /users", () => {
  it("should create a user", async () => {
    const res = await supertest(server).post("/users").send({
      email: 'example@gmail.com',
      password: 'example.123',
      username: 'example',
      fullname: 'example example example',
      jobtitle: 'example',
      brief: 'example example exampleexample example exampleexample example example.',
      desiredplaces: ['example','example','example'],
      visitedplaces: ['example','example','example'],
      profilepic: 'https://example.com/example123',
      Odyssey: null,
      savedEvents: null,
      joinedEvents: null,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    //store the id in a global variable for future use
    userId = res.body.id;
  });
  });

  //testing the POST /users/login endpoint
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
      user = res.body.user;
    });
  });

  // testing the GET /users by ID or query endpoint
  describe("GET /users", () => {
    // test scenario 1: Retrieve a user by ID
    it("should return a user by ID", async () => {
      const res = await supertest(server).get(`/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    // test scenario 2: Query for users
    it("should return a list of users matching the query", async () => {
      // Define a query, e.g., search for users with a specific property
      const query = { username: "example" };
      const res = await supertest(server).get("/users").query(query);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('users');
    });
  });

  //testing the PUT /users endpoint
  describe("PUT /users/:id", () => {
    it("should update a user", async () => {
      const res = await supertest(server)
        .patch("users/userId")
        .send({
          password: 'new password',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('updatedUser');
    });
  });
  
  //testing the DELETE endpoint
  describe("DELETE /users/:id", () => {
    it("should delete a user", async () => {
      const res = await supertest(server).delete(
        "users/userId"
      );
      expect(res.statusCode).toBe(200);
    });
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