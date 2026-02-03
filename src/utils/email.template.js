// emailTemplate.js
const emailTemplate = ( otp, year, company ) => {
return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your One-Time Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:24px; text-align:center; background-color:#0f62fe; color:#ffffff;">
              <h1 style="margin:0; font-size:20px;">Verification Code</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px; color:#333333;">
              <p style="margin:0 0 12px; font-size:14px;">
                Hi,
              </p>

              <p style="margin:0 0 20px; font-size:14px;">
                Use the following One-Time Password (OTP) to complete your verification. This code is valid for <strong>5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:24px 0;">
                <span style="
                  display:inline-block;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#0f62fe;
                  padding:12px 24px;
                  border:1px dashed #0f62fe;
                  border-radius:6px;
                ">
                  ${otp}
                </span>
              </div>

              <p style="margin:20px 0 0; font-size:14px;">
                If you didn’t request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px; text-align:center; font-size:12px; color:#777777; background-color:#f9fafb;">
              <p style="margin:0;">
                © ${year} ${company}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`
}
export default emailTemplate