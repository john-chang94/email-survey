import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

class SurveyList extends Component {
    componentDidMount() {
        this.props.fetchSurveys();
    }

    renderSurveys = () => {
        return this.props.surveys && this.props.surveys.reverse().map((survey, index) => (
            <div className="card blue-grey darken-1" key={index}>
                <div className="card-content">
                    <span className="card-title white-text">{survey.title}</span>
                    <p className="white-text">{survey.body}</p>
                    <p className="right white-text">Sent: {new Date(survey.dateSent).toLocaleDateString()}</p>
                </div>
                <div className="card-action">
                    <a>Yes: {survey.yes}</a>
                    <a>No: {survey.no}</a>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div>
                {
                    this.renderSurveys()
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        surveys: state.surveys.surveys
    }
}

export default connect(mapStateToProps, actions)(SurveyList);