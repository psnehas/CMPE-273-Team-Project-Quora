import React, { Component } from 'react';

import style from '../../Profile.module.css'

class FollowingContent extends Component {
    render() {
        return (
            <h3 className={style.contentTitle}>
                <div>
                    Following
                </div>
            </h3>
        )
    }
}

export default FollowingContent;