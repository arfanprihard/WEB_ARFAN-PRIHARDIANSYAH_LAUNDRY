import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbPool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

dbPool
  .getConnection()
  .then((connection) => {
    console.log("Berhasil terhubung ke database");
    connection.release();
  })
  .catch((err) => {
    console.error("Gagal konek ke database, Error: " + err.message);
  });

const query = async (sql, params = []) => {
  const [result] = await dbPool.execute(sql, params);
  return result;
};

export default query;
