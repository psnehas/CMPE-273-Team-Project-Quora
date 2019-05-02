import React, { Component } from 'react';

import style from '../../Profile.module.css'

class ProfileContent extends Component {
    render() {
        return (
            <h3 className={style.contentTitle}>
                <div>
                    Profile
                </div>
            </h3>
        )
    }
}

export default ProfileContent;