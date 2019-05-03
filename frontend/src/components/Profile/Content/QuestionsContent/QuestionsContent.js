import React, { Component } from 'react';

import style from '../../Profile.module.css'

class QuestionsContent extends Component {
    render() {
        return (
            <h3 className={style.contentTitle}>
                <div>
                    Questions
                </div>
            </h3>
        )
    }
}

export default QuestionsContent;