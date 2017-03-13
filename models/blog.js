var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    description: String,
    text: String,
    image:String,
    created: {type:Date, default:Date.now},
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }       
    ]
});





module.exports = mongoose.model("Blog", blogSchema);
