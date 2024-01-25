import express from 'express';
import Odyssey from '../models/odyssey.mjs';
import 'dotenv/config';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});


const router = express.Router();





//Handling Odysseys CRUD...

// POST method - Create a new odyssey
router.post('/odysseys', requireAuth,  (req, res) => {
    const newOdyssey = new Odyssey(req.body);
    newOdyssey.save()
        .then((result) => res.send("Odyssey created: \n" + newOdyssey + "\nResult:\n" + result))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve odysseys
router.get('/odysseys', requireAuth,  (req, res) => {
    if (req.query.id) {
        Odyssey.findById(req.query.id)
            .then((odyssey) => {
                if (odyssey) res.json(odyssey);
                else res.status(404).send('Odyssey not found');
            })
            .catch((err) => res.status(500).send("Error retrieving odyssey: " + err));
    } else {
        let query = req.query;
        Odyssey.find(query)
            .then((odysseys) => {
                if (odysseys.length > 0) res.json(odysseys);
                else res.status(404).send('No odysseys found matching query');
            })
            .catch((err) => res.status(500).send("Error retrieving odysseys: " + err));
    }
});

// PUT method - Update an odyssey
router.put('/odysseys/:id', requireAuth, (req, res) => {
    Odyssey.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedOdyssey) => {
            if (updatedOdyssey) res.json(updatedOdyssey);
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error updating odyssey: " + err));
});

// DELETE method - Delete an odyssey
router.delete('/odysseys/:id', requireAuth, (req, res) => {
    Odyssey.findByIdAndDelete(req.params.id)
        .then((deletedOdyssey) => {
            if (deletedOdyssey) res.send('Odyssey deleted successfully');
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error deleting odyssey: " + err));
});

// POST method - Participate in an Odyssey
router.post('/odysseys/:id/participate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Un-participate from an Odyssey
router.post('/odysseys/:id/unparticipate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});




export default router;