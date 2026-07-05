const approvalEmailTemplate = ({
  name,
  leaveType,
  decision,
  remark,
}) => {
  const approved = decision === "approved";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Leave ${approved ? "Approved" : "Rejected"}</title>
</head>

<body style="
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
background:${approved ? "#198754" : "#dc3545"};
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

Your leave request has been
<b>${approved ? "APPROVED ✅" : "REJECTED ❌"}</b>
by the Approving Authority.

</p>

<table
width="100%"
cellpadding="12"
style="border-collapse:collapse;">

<tr>
<td><b>Leave Type</b></td>
<td>${leaveType}</td>
</tr>

<tr>
<td><b>Final Decision</b></td>
<td>${approved ? "Approved" : "Rejected"}</td>
</tr>

<tr>
<td><b>Remark</b></td>
<td>${remark}</td>
</tr>

</table>

<p style="margin-top:25px;">

${
  approved
    ? "Your leave has been approved successfully. No further action is required."
    : "Your leave request has been rejected. Please contact your department if you need more information."
}

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
  approvalEmailTemplate,
};