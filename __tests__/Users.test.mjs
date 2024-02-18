import mongoose from "mongoose";
import 'dotenv/config';
import supertest from "supertest";
import server from '../server.mjs';


/* Connecting to the database before each test. */
beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.OdysseyDB_URI);
    }
  });


let userId; // Declare userId at the top level
let token; // Store token globally within test file


  //testing the Users router endpoints...

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
      savedEvents: [],
      joinedEvents: [],
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    //store the id in a global variable for future use
    userId = res.body._id;
    token = res.body.token;
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
      userId = res.body.user._id;
      token = res.body.token;
    });
  });

  // testing the GET /users for both retrieving by ID and querying users
  describe("GET /users", () => {
    // Test scenario 1: Retrieve a user by ID using query parameter
    it("should return a user by ID", async () => {
        const res = await supertest(server)
            .get("/users")
            .query({ id: userId }) // Use query parameter for user ID
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userInfo');
    });

    // Test scenario 2: Query for users based on a specific property
    it("should return a list of users matching the query", async () => {
        // Define a query, e.g., search for users with a specific username
        const query = { username: "example" };
        const res = await supertest(server)
            .get("/users")
            .query(query) // Pass query as query parameters
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('users');
    });
  });

  //testing the PUT /users endpoint
  describe("PUT /users/:id", () => {
    it("should update a user", async () => {
      const res = await supertest(server)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'new password' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('updatedUser');
    });
  });
  
  // //testing the DELETE endpoint
  // describe("DELETE /users/:id", () => {
  //   it("should delete a user", async () => {
  //     const res = await supertest(server).delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
  //     expect(res.statusCode).toBe(200);
  //   });
  // });



 

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.disconnect();
  });