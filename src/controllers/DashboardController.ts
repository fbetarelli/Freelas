import * as ClientServices from  "../services/ClientServices.ts";
import * as JobServices from  "../services/JobServices.ts";
import * as UserServices from  "../services/UserServices.ts";
import { asyncHandler } from  "../utils/asyncHandler.ts";

export const showDashboard = asyncHandler(async (req, res) => {
  if (req.session.user === undefined || req.session.user === null) {
    return res.redirect("/login");
  }

  const clients = await ClientServices.getLatestClients(req.session.user.id);
  const jobs = await JobServices.getLastJobsByUser(req.session.user.id);
  const user = await UserServices.getProfitFromLastMonth(req.session.user.id);
  const lastJobs = await UserServices.getJobCount(req.session.user.id);

  res.render("dashboard", {
    //@ts-ignore
    clients: clients.clients,
    //@ts-ignore

    jobs: jobs.jobs,
    profit: user.profit,
    username: req.session.user.username,
    count: lastJobs,
  });
});
