import * as ClientServices from "../../entities/client/services.ts";
import * as JobServices from "../../entities/job/services.ts";
import * as UserServices from "../../entities/user/services.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

export const showDashboard = asyncHandler(async (req, res) => {
  const [clients, jobs, profit, lastJobs] = await Promise.all([
    ClientServices.getLatestClients(req.user!.id),
    JobServices.getLastJobsByUser(req.user!.id),
    UserServices.getProfitFromLastMonth(req.user!.id),
    UserServices.getJobCount(req.user!.id),
  ]);

  res.status(200).json({
    clients,
    jobs,
    profit,
    count: lastJobs,
  });
});
