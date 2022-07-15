import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

export interface IProject {
    _id: ObjectId,
    name: string,
    expired: boolean,
    ownerId: ObjectId,
    teamId: ObjectId,
    roles: {
        [groupId: string]: string[],
    }
}

const projectSchema = new Schema<IProject>({
    name: String,
    expired: Boolean,
    ownerId: mongoose.Types.ObjectId,
    teamId: mongoose.Types.ObjectId,
    roles: {
        String: [String],
    },
});

mongoose.pluralize(null);
export default mongoose.model('project', projectSchema);
