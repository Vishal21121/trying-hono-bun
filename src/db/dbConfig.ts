import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(String(process.env.MONGO_URI))
        console.log(`Connected to mongodb ${connection.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to mongodb", error)
        process.exit(1)
    }
}

export default connectToDB
