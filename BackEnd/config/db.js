const mongoose = require("mongoose");
const config = require("config");
const db = config.get('mongoURI');

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
           // useCreateIndex: true,
           // useFindAndModify: false
        });

        console.log("Mongo DB connected");
    } catch (err) {
        console.error(err.massage);

        //exit if failure
        process.exit(1);
    }
}
module.exports = connectDB;