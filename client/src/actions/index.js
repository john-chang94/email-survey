import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async (dispatch) => {
    const res = await axios.get('/api/current_user');
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

export const handleToken = (token) => async (dispatch) => {
    const res = await axios.post('/api/stripe', token);
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

export const submitSurvey = (values, history) => async (dispatch) => {
    const res = await axios.post('/api/surveys', values)
    // history comes from withRouter in SurveyFormReview
    history.push('/surveys');
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

// All type FETCH_USER because these endpoints return the user once complete (also check authReducer)