import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const memorySchema = new Schema({
    media: { type: String, required: true },
    likes: { type: Number, default: 0 },
    user: { type: ObjectId, ref: 'User' },
    location: { type: String, ref: 'Location' },
    event: { type: ObjectId, ref: 'Event' },
    odyssey: { type: ObjectId, ref: 'Odyssey' },
}, { timestamps: true });

export default mongoose.model('Memory', memorySchema);