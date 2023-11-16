import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    fullname: { type: String, required: true, maxlength: 30 },
    jobtitle: { type: String },
    brief: { type: String, required: true },
    desiredplaces: { type: [String], required: true },
    visitedplaces: { type: [String], required: true },
    profilepic: { type: String },
    Odyssey: {type: ObjectId, ref: 'Odyssey'},
    savedEvents: {type: [ObjectId], ref: 'Event'},
    joinedEvents: {type: [ObjectId], ref: 'Event'},
}, { timestamps: true });

export default mongoose.model('User', userSchema);