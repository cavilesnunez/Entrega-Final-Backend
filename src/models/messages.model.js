    import { Schema, model } from 'mongoose'

    const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    }
    })

    const MessageModel = model('messages', messageSchema)

    export default MessageModel