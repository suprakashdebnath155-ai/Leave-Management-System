const approvingAssignmentEmailTemplate = ({
  officerName,
  employeeName,
  employeeId,
  department,
  designation,
  leaveType,
  startDate,
  endDate,
  daysRequested,
  reason,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Leave Awaiting Approval</title>
</head>

<body style="margin:0;padding:40px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="650" align="center"
style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.15);">

<tr>
<td style="background:#0d6efd;color:white;padding:25px;text-align:center;font-size:28px;font-weight:bold;">
Leave Management System
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${officerName},</h2>

<p>
A leave request has been recommended by the Reviewing Officer and is awaiting your final approval.
</p>

<table width="100%" cellpadding="10" style="border-collapse:collapse;">

<tr><td><b>Employee Name</b></td><td>${employeeName}</td></tr>
<tr><td><b>Employee ID</b></td><td>${employeeId}</td></tr>
<tr><td><b>Department</b></td><td>${department}</td></tr>
<tr><td><b>Designation</b></td><td>${designation}</td></tr>
<tr><td><b>Leave Type</b></td><td>${leaveType}</td></tr>
<tr><td><b>Start Date</b></td><td>${startDate}</td></tr>
<tr><td><b>End Date</b></td><td>${endDate}</td></tr>
<tr><td><b>Working Days</b></td><td>${daysRequested}</td></tr>
<tr><td><b>Reason</b></td><td>${reason}</td></tr>

</table>

<p style="margin-top:25px;">
Please log in to the Leave Management System and make the final decision.
</p>

<div style="text-align:center;margin-top:30px;">
<a href="http://localhost:5173/login"
style="background:#0d6efd;color:white;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">
Review Request
</a>
</div>

<hr>

<p style="text-align:center;color:#777;font-size:13px;">
Leave Management System
</p>

</td>
</tr>

</table>

</body>
</html>
`;
};

module.exports = {
  approvingAssignmentEmailTemplate,
};