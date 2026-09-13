import { app } from "./app.ts";

const envPORT = process.env.PORT;
const port = envPORT ? Number(envPORT) : 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error(`Error on Starting Server: ${err}`);
  }
  console.log(`Server running on port: ${port}!`);
});
