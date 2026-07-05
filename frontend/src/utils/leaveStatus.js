export function getLeaveStatus(leave) {
  if (leave.status === "cancelled") return "cancelled";
  if (leave.status === "approved" || leave.approvingStatus === "approved") return "approved";
  if (
    leave.status === "rejected" ||
    [leave.reportingStatus, leave.reviewingStatus, leave.approvingStatus].includes("rejected")
  ) return "rejected";
  if (leave.reviewingStatus === "recommended") return "pending approval";
  if (leave.reportingStatus === "recommended") return "pending review";
  return "pending reporting";
}
