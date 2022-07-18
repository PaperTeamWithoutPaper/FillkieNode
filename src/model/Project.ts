import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IProject {
    _id: ObjectId,
    name: string,
    expired: boolean,
    ownerId: ObjectId,
    teamId: ObjectId,
}

const projectSchema = new Schema<IProject>({
    name: String,
    expired: Boolean,
    ownerId: ObjectId,
    teamId: ObjectId,
});

mongoose.pluralize(null);
export default mongoose.model('Project', projectSchema);
