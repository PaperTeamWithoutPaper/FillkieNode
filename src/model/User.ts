import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IUser {
    _id: ObjectId,
    email: string,
    name: string,
    image: string,
    google: {
        expiryDate: number,
        accessToken: string,
        refreshToken: string,
    }
    teams: string[],
}

const userSchema = new Schema<IUser>({
    email: String,
    name: String,
    image: String,
    google: {
        expiryDate: Number,
        accessToken: String,
        refreshToken: String,
    },
    teams: [String],
});

mongoose.pluralize(null);
export default mongoose.model('User', userSchema);
