const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { types: String, required: true },
        password: { type:String, required: true },
        pic: {
            type: String,
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;