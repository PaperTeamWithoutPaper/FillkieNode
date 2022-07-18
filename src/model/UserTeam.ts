import mongoose, {Schema} from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

export interface IUserTeam {
    _id: ObjectId,
    teamId: ObjectId,
    userId: ObjectId,
    teamName: string,
}

const userTeamSchema = new Schema<IUserTeam>({
    teamId: ObjectId,
    userId: ObjectId,
    teamName: String,
});

mongoose.pluralize(null);
export default mongoose.model('UserTeam', userTeamSchema);
