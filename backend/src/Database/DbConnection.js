import { Sequelize } from "sequelize";

const db = new Sequelize("eTeras", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  await db.authenticate();
  console.log("Db connected successfully");
  await db.sync({ force: true });
} catch (error) {
  console.error(
    `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
  );
}
export default db;
