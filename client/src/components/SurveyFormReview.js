import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/index';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
    // lodash syntax for .map ([arr to map through], (object var))
    const reviewFields = _.map(formFields, ({ name, label }) => (
        <div key={name}>
            <label>{label}</label>
            <div>
                {formValues[name]}
            </div>
        </div>
    ))
    return (
        <div>
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <div style={{ marginTop: '15px' }}>
                <button className="btn-flat yellow darken-3 white-text" onClick={onCancel}>Back</button>
                <button className="btn-flat green white-text right" onClick={() => submitSurvey(formValues, history)}>
                    Send Survey
                <i className="material-icons right">email</i>
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        formValues: state.form.surveyForm.values // Grabbing from reduxForm
    }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview)); // withRouter provides history prop