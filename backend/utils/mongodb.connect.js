import mongoose from "mongoose";

mongoose.connect("mongodb+srv://xaayrole_db_user:O4S1c1mqHl7pbgyK@personal-projects.7z3nm0c.mongodb.net/?appName=personal-projects").then(res=>{
    console.log("mongodb is connected.");
}).catch(err=>{
    console.log(err);
})

export default mongoose;