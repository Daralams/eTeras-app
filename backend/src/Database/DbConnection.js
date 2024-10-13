import { Sequelize } from "sequelize";

const db = new Sequelize("siblogger", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  await db.authenticate();
  console.log("Db connected successfully");
  // await db.sync({force:true})
} catch (error) {
  console.error(error.message);
}

export default db;
