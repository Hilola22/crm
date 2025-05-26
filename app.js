const express = require("express");
const config = require("config");
const PORT = config.get("port");
const indexRouter = require("./routes/index")

const app = express();
app.use(express.json());

app.use("/api", indexRouter)

async function start() {
  try {
    console.log(`Salom`);
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
