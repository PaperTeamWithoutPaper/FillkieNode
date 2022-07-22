import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IProjectPermission {
    _id: ObjectId,
    projectId: ObjectId
    groupId: ObjectId,
    permission: {
        [key: string] : boolean
    }
}

const projectPermissionSchema = new Schema<IProjectPermission>({
    projectId: ObjectId,
    groupId: ObjectId,
    permission: {
        key: Boolean,
    },
});

mongoose.pluralize(null);
export default mongoose.model('projectPermission', projectPermissionSchema);
