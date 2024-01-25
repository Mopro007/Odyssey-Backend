import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    location: String,
    date: Date,
});

const odysseySchema = new Schema({
    title: { type: String, required: true, maxlength: 30 },
    description: { type: String, required: true, maxlength: 250 },
    itinerary: { type: [itinerarySchema], required: true },
    banner: { type: String },
    participants: { type: [ObjectId], ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Odyssey', odysseySchema);