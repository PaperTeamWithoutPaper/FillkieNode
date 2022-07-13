import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: 'string',
    },
    name: {
        type: 'string',
    },
    teams: [{
        type: 'string',
    }],
    accessToken: {
        type: 'string',
    },
    refreshToken: {
        type: 'string',
    },
});

export default mongoose.model('User', userSchema);
