import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint Not Found" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode, port: ${PORT}`,
    );
  }
});
