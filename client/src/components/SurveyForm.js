import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
    renderFields() {
        return _.map(formFields, ({ label, name }) => (
            <Field key={name} component={SurveyField} type="text" label={label} name={name} />
        ))
        // return (
        //     <div>
        //         <Field type="text" label="Survey Title" name="title" component={SurveyField} />
        //         <Field type="text" label="Subject Line" name="subject" component={SurveyField} />
        //         <Field type="text" label="Email Body" name="body" component={SurveyField} />
        //         <Field type="text" label="Recipient List" name="emails" component={SurveyField} />
        //     </div>
        // )
    }
    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    { this.renderFields() }
                    <Link to="/surveys" className="btn-flat red white-text">
                        Cancel
                    </Link>
                    <button className="btn-flat teal white-text right">
                        Next
                        <i className="material-icons right">arrow_forward</i>
                    </button>
                </form>
            </div>
        )
    }
}

function validate(values) {
    // values come from reduxForm
    const errors = {};
    errors.recipients = validateEmails(values.recipients || '');

    _.each(formFields, ({ name, label }) => {
        if (!values[name]) {
            errors[name] = `${label} required`
        }
    })

    return errors;
}

export default reduxForm({
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false // Will keep the form values for review
})(SurveyForm);