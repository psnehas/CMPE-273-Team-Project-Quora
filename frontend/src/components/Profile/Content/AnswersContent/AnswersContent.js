import React, { Component } from 'react';

import style from '../../Profile.module.css'

class AnswersContent extends Component {
    render() {
        return (
            <h3 className={style.contentTitle}>
                <div>
                    Answers
                </div>
            </h3>
        )
    }
}

export default AnswersContent;