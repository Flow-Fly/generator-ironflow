import mongoose from "mongoose";

async function connect() {
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Connected to database ${db.connection.name}`);
	} catch (error) {
		console.log(
			`Something went wrong when connecting to the database: ${error.message}`,
			error
		);
	}
}

export default connect;
