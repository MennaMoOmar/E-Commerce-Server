require("dotenv").config();

const requiredEnvs = ["MONGO_URI"];
const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length) {
  throw new Error(`missing env ${missingEnvs}`);
}

module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommereceapi",
  port: process.env.PORT || 3001,
  jwtSecret: "@#5435()&<>#Menna",
};
