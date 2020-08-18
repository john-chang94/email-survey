const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url'); // No npm necessary
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for your feedback!');
    })

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        _.chain(req.body)
        // url and email are properties from sendgrid response
            .map(({ email, url }) => {
                // Cannot destructure match if objected returned is null
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice }
                }
            })
            .compact() // Remove undefined responses
            .uniqBy('email', 'surveyId') // Remove responses with duplicate values for BOTH email and survey
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                    // Increment the 'yes' or 'no' property by 1
                    $inc: { [choice]: 1 },
                    // $ is like the index of the record that was just found above
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }).exec();
            })
            .value();

        // const events = _.map(req.body, (event) => {
        //     // .url is a property from sendgrid response
        //     // .pathname extracts path after domain
        //     const pathname = new URL(event.url).pathname;
        //     const match = p.test(pathname);
        //     if (match) {
        //         return { email: event.email, surveyId: match.surveyId, choice: match.choice };
        //     }
        // })

        // const compactEvents = _.compact(events);
        // const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
    })

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        })

        const mailer = new Mailer(survey, surveyTemplate(survey));
        try {
            await mailer.send(); // send method from class Mailer that we made
            await survey.save(); // Save survey in db
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err); // 422 - error in survey form data
        }

    })
}