//Definindo Consts
import { config } from "dotenv";
config();
import express, {
  static as exStatic,
  urlencoded,
  json,
  type ErrorRequestHandler,
} from "express";
import session from "express-session";
import { userRoutes } from "./src/resources/User/routes.ts";
import DashboardRoutes from "./src/features/Dashboard/routes.ts";
import ClientRoutes from "./src/resources/Client/routes.ts";
import JobRoutes from "./src/resources/Job/routes.ts";
import { join } from "path";
import flash from "connect-flash";

import logger from "morgan";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT;

//App.set diretórios
app.set("view engine", "ejs");
app.set("views", join(import.meta.dirname, "src/views"));
app.use(exStatic(join(import.meta.dirname, "public")));

//App.use imports
app.use(logger("dev"));
app.use(flash());
app.use(helmet());

//Body parser
app.use(urlencoded({ extended: true }));
app.use(json());

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "stealthy-secret",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // um ano
    },
  }),
);

//Rotas
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

userRoutes(app);
app.use("/", DashboardRoutes);
app.use("/", ClientRoutes);
app.use("/", JobRoutes);

const errorHandler: ErrorRequestHandler = (
  err: Error & {
    code?: number | string;
    customMessage?: string;
  },
  _req,
  res,
  //eslint-disable-next-line
  _next,
) => {
  console.error(err);

  res.status(500).render("erro", {
    title: err.code ?? "500",
    message: err.customMessage ?? "Indeterminado",
  });
};

app.use(errorHandler);

//middleware generico pega tudo que nao foi tratado antes
app.use((req, res) => {
  res.status(404).render("erro", {
    title: "404",
    message: "Página não encontrada",
  });
});

const port = PORT ? Number(PORT) : 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error(`Erro ao iniciar server ${err}`);
  }
  console.log(`Servidor rodando na porta: ${PORT}!`);
});
