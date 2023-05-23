import { Schema, model } from "mongoose"

const userSchema = new Schema(
	{
		username: {
			type: String,
			maxLength: 50,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			// select : false allow us to not have the password returned to us by default.
			select: false,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			// This regular expression is a bit simpler than what seen in class but might have some uncovered edge-cases.
			match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
)

const User = model("User", userSchema)

export default User
