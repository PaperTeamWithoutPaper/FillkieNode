import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IGroupUser {
    _id: ObjectId,
    teamId: ObjectId,
    groupId: ObjectId,
    userId: ObjectId,
}

const groupUserSchema = new Schema<IGroupUser>({
    teamId: ObjectId,
    groupId: ObjectId,
    userId: ObjectId,
});

mongoose.pluralize(null);
export default mongoose.model('GroupUser', groupUserSchema);
