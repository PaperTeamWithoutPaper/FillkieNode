import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IGroupPermission {
    _id: ObjectId,
    teamId: ObjectId,
    groupId: ObjectId,
    permissionCode: number,
}

const groupPermissionSchema = new Schema<IGroupPermission>({
    teamId: ObjectId,
    groupId: ObjectId,
    permissionCode: Number,
});

mongoose.pluralize(null);
export default mongoose.model('groupPermission', groupPermissionSchema);
