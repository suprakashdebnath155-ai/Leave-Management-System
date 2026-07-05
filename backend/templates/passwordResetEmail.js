const passwordResetEmailTemplate = ({
  name,
  resetLink,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Reset Password</title>
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
background:#0d6efd;
padding:25px;
color:white;
text-align:center;
font-size:28px;
font-weight:bold;
">
LeaveFlow
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${name},</h2>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to create a new password.
</p>

<div style="margin:35px 0;text-align:center;">

<a
href="${resetLink}"
style="
background:#0d6efd;
color:white;
padding:14px 30px;
border-radius:6px;
text-decoration:none;
font-weight:bold;
">
Reset Password
</a>

</div>

<p>
This link will expire in <b>30 minutes</b>.
</p>

<p>
If you did not request this, simply ignore this email.
</p>

<hr>

<p
style="
font-size:13px;
text-align:center;
color:#777;
">
LeaveFlow Leave Management System
</p>

</td>
</tr>

</table>

</body>
</html>
`;
};

module.exports = {
  passwordResetEmailTemplate,
};