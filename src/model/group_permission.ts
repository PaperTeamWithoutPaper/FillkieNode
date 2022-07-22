import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IGroupPermission {
    teamId: ObjectId,
    groupId: ObjectId,
    permission: {
        [key: string] : boolean
    }
}

const groupPermissionSchema = new Schema<IGroupPermission>({
    teamId: ObjectId,
    groupId: ObjectId,
    permission: {
        key: Boolean,
    },
});

mongoose.pluralize(null);
export default mongoose.model('groupPermission', groupPermissionSchema);
