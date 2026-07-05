const cancellationEmailTemplate = ({
  name,
  leaveType,
  startDate,
  endDate,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Leave Cancelled</title>
</head>

<body style="margin:0;padding:40px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="600" align="center"
style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.15);">

<tr>
<td style="background:#dc3545;padding:25px;color:white;text-align:center;font-size:28px;font-weight:bold;">
Leave Management System
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${name},</h2>

<p>
Your leave request has been cancelled successfully.
</p>

<table width="100%" cellpadding="12">

<tr>
<td><b>Leave Type</b></td>
<td>${leaveType}</td>
</tr>

<tr>
<td><b>Start Date</b></td>
<td>${startDate}</td>
</tr>

<tr>
<td><b>End Date</b></td>
<td>${endDate}</td>
</tr>

<tr>
<td><b>Status</b></td>
<td style="color:#dc3545;"><b>Cancelled</b></td>
</tr>

</table>

<p style="margin-top:25px;">
Your leave has been removed from the approval workflow.
</p>

<hr>

<p style="font-size:13px;text-align:center;color:#777;">
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
  cancellationEmailTemplate,
};