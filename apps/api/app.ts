import express from "express";
import { loaders } from "./src/loaders/index.ts";
import { config } from "dotenv";
config();

const app = express();
loaders(app);

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Middleware genérico pra 404
app.use((req, res) => {
  res.status(404).render("erro", {
    title: "404",
    message: "Página não encontrada",
  });
});

const envPORT = process.env.PORT;
const port = envPORT ? Number(envPORT) : 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error(`Erro ao iniciar server ${err}`);
  }
  console.log(`Servidor rodando na porta: ${port}!`);
});
