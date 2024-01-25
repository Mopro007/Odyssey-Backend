import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true, maxlength: 30 },
    description: { type: String, required: true, maxlength: 250 },
    location: {type: String, required: true},
    starts: { type: Date, required:true },
    ends: { type: Date, required: true },
    participants: { type: [ObjectId], ref: 'User' },
    memories: { type: [String]}
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);