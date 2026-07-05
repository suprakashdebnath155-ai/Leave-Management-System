const leaveAppliedEmailTemplate = ({
  name,
  leaveType,
  startDate,
  endDate,
  daysRequested,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Leave Applied</title>
</head>

<body
style="
margin:0;
padding:40px;
background:#f4f6f9;
font-family:Arial,Helvetica,sans-serif;
">

<table
width="600"
align="center"
style="
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 2px 12px rgba(0,0,0,.15);
">

<tr>

<td
style="
background:#0d6efd;
padding:25px;
color:white;
font-size:28px;
font-weight:bold;
text-align:center;
">

Leave Management System

</td>

</tr>

<tr>

<td style="padding:35px;">

<h2>Hello ${name},</h2>

<p>

Your leave application has been submitted successfully.

</p>

<table
width="100%"
cellpadding="12"
style="
border-collapse:collapse;
margin-top:20px;
">

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

<td><b>Working Days</b></td>

<td>${daysRequested}</td>

</tr>

<tr>

<td><b>Status</b></td>

<td style="color:#ff9800;">
Pending Approval
</td>

</tr>

</table>

<p
style="
margin-top:30px;
">

Your leave request has been forwarded to the Reporting Officer.

</p>

<hr>

<p
style="
font-size:13px;
text-align:center;
color:#666;
">

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
  leaveAppliedEmailTemplate,
};