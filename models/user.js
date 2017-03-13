var mongoose                = require("mongoose"),
    Schema                  = mongoose.Schema,
    passportLocalMongoose   = require("passport-local-mongoose");

    var userSchema = new Schema ({

        username: String,
        password: String

    });
    userSchema.plugin(passportLocalMongoose); //adds the methods to this Schema for security and hash/salt

module.exports=mongoose.model("User", userSchema);






