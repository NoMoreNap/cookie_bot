import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    tid: {
        type: Number,
        required: true
    },
    reffer_tid: {
        type: Number,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    reg_ts: {
        type: Number,
        required: false
    },
    info: {
        last_name: {
            type: String,
            required: false
        },
        first_name: {
            type: String,
            required: false
        },
        refferals: {
            type: [Number],
            required: false
        },
        oppend_cookie: {
            type: Number,
            required: false
        },
        limit: {
            type: Number,
            required: false
        },
        cookies: {
            type: [Number],
            required: false
        }
    }
});

export default mongoose.model('user', userSchema)
