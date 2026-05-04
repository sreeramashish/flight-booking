const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.RESEND_API_KEY) {
        console.log(`\n\n[DEV MODE] !! RESEND_API_KEY MISSING !!`);
        console.log(`[DEV MODE] Subject: ${subject}`);
        console.log(`[DEV MODE] To: ${to}`);
        console.log(`[DEV MODE] Content: ${html}\n\n`);
        return { success: true, devMode: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'SkyBooker <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html
        });

        if (error) {
            console.error(`[ERROR] Resend API error:`, error);
            return { success: false, error };
        }

        console.log(`[SUCCESS] Email sent successfully to: ${to}`, data);
        return { success: true, data };
    } catch (error) {
        console.error(`[ERROR] Failed to send email via Resend:`, error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
