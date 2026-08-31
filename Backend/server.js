import express from "express";

const app = express();

const PORT = 5003;

app.get("/", (req, res) => {
  res.send("WebRTC Meeting Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});