const https = require("node:https");

const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const LOCAL_ISSUER_CERT_ERROR = "UNABLE_TO_GET_ISSUER_CERT_LOCALLY";

const shouldUseInsecureEmailTlsFallback = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.ALLOW_INSECURE_EMAIL_TLS !== "false";

const withEmailTlsFallback = async (sendOperation) => {
  try {
    return await sendOperation();
  } catch (error) {
    if (
      error?.code !== LOCAL_ISSUER_CERT_ERROR ||
      !shouldUseInsecureEmailTlsFallback()
    ) {
      throw error;
    }

    const previousAgent = defaultClient.requestAgent;

    defaultClient.requestAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      return await sendOperation();
    } finally {
      defaultClient.requestAgent = previousAgent;
    }
  }
};

const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
      console.warn("Email skipped: BREVO_API_KEY or SENDER_EMAIL is missing.");

      return null;
    }

    console.log("Sending email...");

    const sender = {
      email: process.env.SENDER_EMAIL,
      name: "HMS System",
    };

    const receivers = [
      {
        email: to,
      },
    ];

    const response = await withEmailTlsFallback(() =>
      tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject,
        htmlContent,
      }),
    );

    console.log("Email sent successfully");

    return response;
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    if (error.response) {
      console.error(error.response.body);
    }

    throw error;
  }
};

module.exports = sendEmail;
