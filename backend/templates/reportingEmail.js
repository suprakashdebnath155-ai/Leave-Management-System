const reportingEmailTemplate = ({
  name,
  leaveType,
  decision,
  remark,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Reporting Officer Review</title>
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

Your leave request has been reviewed by the
<b>Reporting Officer.</b>

</p>

<table
width="100%"
cellpadding="12"
style="
border-collapse:collapse;
">

<tr>

<td><b>Leave Type</b></td>

<td>${leaveType}</td>

</tr>

<tr>

<td><b>Decision</b></td>

<td>${decision}</td>

</tr>

<tr>

<td><b>Remark</b></td>

<td>${remark}</td>

</tr>

</table>

<p
style="
margin-top:25px;
">

Your application has now been forwarded to the
<b>Reviewing Officer.</b>

</p>

<hr>

<p
style="
font-size:13px;
text-align:center;
color:#777;
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
  reportingEmailTemplate,
};