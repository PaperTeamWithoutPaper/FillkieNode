import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IProfile {
    _id: ObjectId,
    teamId: ObjectId,
    userId: ObjectId,
    name: string,
    image: string,
}

const profileSchema = new Schema<IProfile>({
    teamId: ObjectId,
    userId: ObjectId,
    name: String,
    image: String,
});

mongoose.pluralize(null);
export default mongoose.model('profile', profileSchema);
