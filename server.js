const express = require("express");
require("dotenv").config();
const db = require("./db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use(express.json());
const PORT = process.env.PORT || 8000;

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});
