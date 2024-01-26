import mongoose from "mongoose";
import 'dotenv/config';
import supertest from "supertest";
import server from '../server.mjs';

const request = supertest(server);

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.OdysseyTestingDB_URI);
  });

  //testing the Users router endpoints...
  //testing the GET /users/test endpoint
  describe("GET /users/test", () => {
    it("should return a test message", async () => {
      const res = await request(server).get("/users/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Hello World!");
    });
  });

  //testing the POST /users create new user endpoint
  describe("POST /users", () => {
  it("should create a user", async () => {
    const res = await request(server).post("/users").send({
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
      const res = await request(server).post("/users/login").send({
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
      const res = await request(server).get(`/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    // test scenario 2: Query for users
    it("should return a list of users matching the query", async () => {
      // Define a query, e.g., search for users with a specific property
      const query = { username: "example" };
      const res = await request(server).get("/users").query(query);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('users');
    });
  });

  //testing the PUT /users endpoint
  describe("PUT /users/:id", () => {
    it("should update a user", async () => {
      const res = await request(server)
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
      const res = await request(server).delete(
        "users/userId"
      );
      expect(res.statusCode).toBe(200);
    });
  });



  //testing the Odysseys router endpoints...
  // POST method - Create a new odyssey
  describe("POST /odysseys", () => {
    it("should create an odyssey", async () => {
      const res = await request(server).post("/odysseys").send({
        // Your odyssey data here
      });
      expect(res.statusCode).toBe(201); // Assuming you send 201 for creation
    });
  });
  
  // GET method - Retrieve odysseys
  describe("GET /odysseys", () => {
    it("should return all odysseys", async () => {
      const res = await request(server).get("/odysseys");
      expect(res.statusCode).toBe(200);
    });
  });
  
  // PUT method - Update an odyssey
  describe("PUT /odysseys/:id", () => {
    it("should update an odyssey", async () => {
      const res = await request(server).put("/odysseys/someId").send({
        // Updated data
      });
      expect(res.statusCode).toBe(200);
    });
  });
  
  // DELETE method - Delete an odyssey
  describe("DELETE /odysseys/:id", () => {
    it("should delete an odyssey", async () => {
      const res = await request(server).delete("/odysseys/someId");
      expect(res.statusCode).toBe(200);
    });
  });



  //testing the Events router endpoints...
  // POST method - Create a new event
  describe("POST /events", () => {
    // Test case here
  });
  
  // GET method - Retrieve events
  describe("GET /events", () => {
    // Test case here
  });
  
  // PUT method - Update an event
  describe("PUT /events/:id", () => {
    // Test case here
  });
  
  // DELETE method - Delete an event
  describe("DELETE /events/:id", () => {
    // Test case here
  });
  
  // POST method - Participate in an Event
  describe("POST /events/:id/participate", () => {
    // Test case here
  });
  
  // POST method - Save an Event
  describe("POST /users/:id/saveEvent", () => {
    // Test case here
  });
  

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });