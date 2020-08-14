const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');
const { response } = require('express');

class Mailer extends helper.Mail {
    // Constructor allows us to call 'new Mailer()' in surveyRoutes | FUNDAMENTALS!
    constructor({ subject, recipients }, content) {
        super();

        this.sgApi = sendgrid(keys.SENDGRID_KEY);
        this.from_email = new helper.Email('changjohn94@gmail.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        this.addContent(this.body); // addContent comes from helper
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses = recipients => {
        return recipients.map(({ email }) => {
            // Return an array with individual emails
            return new helper.Email(email);
        })
    }

    // This is required for sendgrid tracking
    addClickTracking = () => {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    addRecipients = () => {
        const personalize = new helper.Personalization();

        this.recipients.forEach(recipient => {
            // For each recipient, add to personalize object
            personalize.addTo(recipient);
        })
        // Add the personalized object to addPersonalization method from helper
        this.addPersonalization(personalize);
    }

    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        })

        const response = await this.sgApi.API(request); // API from sendgrid
        return response;
    }
}

module.exports = Mailer;