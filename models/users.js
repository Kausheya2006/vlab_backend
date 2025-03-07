import mongoose from "mongoose";

const {Schema, model} = mongoose;

const UsersSchema = new Schema({
    rank: {type:Number, required: true},
    nodal_centre: {type:String, required: true},
    state: {type:String},
    usage: {type:Number},
    users: {type:Number},
    workshop: {type: Number}
})

export default mongoose.models.Users || model("Users", UsersSchema);