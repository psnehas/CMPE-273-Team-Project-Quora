import React, { Component } from 'react';

import style from '../../Profile.module.css'

class FollowersContent extends Component {
    render() {
        return (
            <h3 className={style.contentTitle}>
                <div>
                    Followers
                </div>
            </h3>
        )
    }
}

export default FollowersContent;