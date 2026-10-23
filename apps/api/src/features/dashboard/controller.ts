import * as ClientServices from "../../entities/client/services.ts";
import * as JobServices from "../../entities/job/services.ts";
import * as UserServices from "../../entities/user/services.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { requireUser } from "../auth/require-user.ts";

export const showDashboard = asyncHandler(async (req, res) => {
  const userId = requireUser(req).id;
  const [clients, jobs, profit, lastJobs] = await Promise.all([
    ClientServices.getLatestClients(userId),
    JobServices.getLastJobsByUser(userId),
    UserServices.getProfitFromLastMonth(userId),
    UserServices.getJobCount(userId),
  ]);

  res.status(200).json({
    clients,
    jobs,
    profit,
    count: lastJobs,
  });
});
