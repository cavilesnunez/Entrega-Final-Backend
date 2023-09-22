import { Schema, model } from "mongoose";

const messagesSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})

const messagesModel = model ('messages', messagesSchema);

export default messagesModel;