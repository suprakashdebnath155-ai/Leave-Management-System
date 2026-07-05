const welcomeEmailTemplate = ({
  name,
  email,
  temporaryPassword,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome</title>
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
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 2px 10px rgba(0,0,0,.15);
">

<tr>
<td
style="
background:#0d6efd;
padding:25px;
text-align:center;
color:white;
font-size:28px;
font-weight:bold;
">
Leave Management System
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2 style="color:#333;">
Welcome, ${name}! 👋
</h2>

<p style="font-size:16px;color:#555;">
Your employee account has been created successfully.
</p>

<table
width="100%"
cellpadding="12"
style="
margin-top:25px;
border:1px solid #ddd;
border-collapse:collapse;
">

<tr>
<td
style="
font-weight:bold;
background:#f7f7f7;
width:180px;
">
Login Email
</td>

<td>
${email}
</td>
</tr>

<tr>
<td
style="
font-weight:bold;
background:#f7f7f7;
">
Temporary Password
</td>

<td>
${temporaryPassword}
</td>
</tr>

</table>

<p style="
margin-top:30px;
font-size:15px;
color:#444;
">

Please login using the above credentials and
change your password immediately.

</p>

<div
style="
margin-top:35px;
text-align:center;
">

<a
href="http://localhost:5173/login"
style="
background:#0d6efd;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
">

Login Now

</a>

</div>

<hr style="margin-top:40px;">

<p
style="
font-size:13px;
color:#777;
text-align:center;
">

Leave Management System<br>
Automated Email • Please do not reply.

</p>

</td>
</tr>

</table>

</body>
</html>
`;
};

module.exports = {
  welcomeEmailTemplate,
};