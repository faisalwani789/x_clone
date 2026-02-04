// emailTemplate.js

const emailTemplate = ( otp,title,message,time, year, company ) => {
return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
   body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
      
    }
    table {
      border-collapse: collapse;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 40px auto;
      border-radius: 6px;
    }
    .content {
      padding: 30px;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }
    .link-box {
      background-color: #f1f3f4;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <table style="width:100%;" >
    <tr>
      <td stle="align:center;">
        <table class="container">
          
          <!-- Header -->
          <tr>
            <td style="content">
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
               ${message} <strong>${time} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div class="link-box">
             
                  ${otp}
                
              </div>

              <p style="margin:20px 0 0; font-size:14px;">
                If you didn’t initiate the request, you can safely ignore this email.
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

// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Email</title>
//   <style>
   
    
//     a {
//       color: #1a73e8;
//       text-decoration: none;
//     }
//     .footer {
//       font-size: 12px;
//       color: #888888;
//       padding: 20px;
//       text-align: center;
//       background-color: #fafafa;
//     }

//     @media screen and (max-width: 600px) {
//       .content {
//         padding: 20px;
//       }
//     }
//   </style>
// </head>

// <body>
//   <table width="100%">
//     <tr>
//       <td align="center">
//         <table class="container" width="100%">
          
//           <!-- Content -->
//           <tr>
//             <td class="content">
//               <p>Hello</p>

//               <p>
//                 Please use the link below to continue. If you did not request this,
//                 you can safely ignore this email.
//               </p>

//               <!-- Long Link -->
//               <div class="link-box">
//                 <a href="{{LONG_LINK}}">
//                   {{LONG_LINK}}
//                 </a>
//               </div>

//               <p style="font-size: 14px; color: #555;">
//                 This link may expire in {{EXPIRY_TIME}}.
//               </p>

//               <p>
//                 Thanks,<br />
//                 <strong>Your Company Team</strong>
//               </p>
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td class="footer">
//               © {{YEAR}} Your Company<br />
//               <a href="{{UNSUBSCRIBE_LINK}}">Unsubscribe</a>
//             </td>
//           </tr>

//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
