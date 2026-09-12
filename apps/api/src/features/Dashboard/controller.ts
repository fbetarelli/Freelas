import * as ClientServices from "../../entities/Client/services.ts";
import * as JobServices from "../../entities/Job/services.ts";
import * as UserServices from "../../entities/User/services.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

export const showDashboard = asyncHandler(async (req, res) => {
  if (req.session.user === undefined || req.session.user === null) {
    return res.redirect("/login");
  }

  const clients = await ClientServices.getLatestClients(req.session.user.id);
  const jobs = await JobServices.getLastJobsByUser(req.session.user.id);
  const profit = await UserServices.getProfitFromLastMonth(req.session.user.id);
  const lastJobs = await UserServices.getJobCount(req.session.user.id);

  res.render("dashboard", {
    clients,
    jobs,
    profit,
    username: req.session.user.username,
    count: lastJobs,
  });
});
