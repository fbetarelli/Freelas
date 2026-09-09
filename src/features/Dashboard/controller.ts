import * as ClientServices from "../../resources/Client/client-services.ts";
import * as JobServices from "../../resources/Job/job-services.ts";
import * as UserServices from "../../resources/User/user-services.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

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
