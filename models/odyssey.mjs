import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    city: String,
    arrivalDate: Date,
    departureDate: Date,
});

const odysseySchema = new Schema({
    title: { type: String, required: true, maxlength: 30 },
    description: { type: String, required: true, maxlength: 250 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    itinerary: { type: [itinerarySchema], required: true },
    currentLocation: { type: String },
    banner: { type: String },
    participants: { type: [ObjectId], ref: 'User' },
    events: { type: [ObjectId], ref: 'Event' },
}, { timestamps: true });

export default mongoose.model('Odyssey', odysseySchema);