import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
    // input props comes from Field component using redux form
    return (
        <div>
            <label htmlFor="">{label}</label>
            <input {...input} style={{ marginBottom: '5px' }} />
            <div className="red-text" style={{ marginBottom: '20px' }}>
                {touched && error}
            </div>
        </div>
    )
}