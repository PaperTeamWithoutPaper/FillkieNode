import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IGroup {
    _id: ObjectId,
    name: string,
    teamId: ObjectId,
}

const groupSchema = new Schema<IGroup>({
    name: String,
    teamId: ObjectId,
});

mongoose.pluralize(null);
export default mongoose.model('group', groupSchema);
