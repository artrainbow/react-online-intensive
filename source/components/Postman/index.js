// Core

import React from 'react';

// Intruments
import Styles from './styles.m.css';
import { withProfile } from 'components/HOC/withProfile';

const Postman = (props) => {
    return (
        <section className = { Styles.postman }>
            <img src = { props.avatar } />
            <span>Welcome online, {props.currentUserFirstName} {props.currentUserLastName}</span>
        </section>
    );
};

export default withProfile(Postman);
