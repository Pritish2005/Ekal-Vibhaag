import mongoose from "mongoose";

const connect = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    console.log("Connected to database");
    return mongoose.connection.db; // Return the db object directly
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Connection failed!");
  }
};

export default connect;
