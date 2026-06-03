const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    console.log("Sending Email...");
    const sender = { email: process.env.SENDER_EMAIL, name: "HMS System",};
    const receivers = [ { email: to,}];

    const response = await tranEmailApi.sendTransacEmail({
      sender,to: receivers,subject, htmlContent,});
    console.log("Email sent successfully");
    console.log(response);
  } catch (error) {
    console.log("Email Error");
    console.log(error);

    if (error.response) {
      console.log(error.response.body);
    }
  }
};
module.exports = sendEmail;
