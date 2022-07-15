import mongoose, {Schema} from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId,
    email: string,
    name: string,
    expired: boolean,
    accessToken: string,
    refreshToken: string,
    teams: string[],
}

const userSchema = new Schema<IUser>({
    email: String,
    name: String,
    expired: Boolean,
    accessToken: String,
    refreshToken: String,
    teams: [String],
});

mongoose.pluralize(null);
export default mongoose.model('user', userSchema);
