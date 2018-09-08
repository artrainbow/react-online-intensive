// Core
import React, { Component } from 'react';
import { number } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

const Counter = ({ count }) => (
    <section className = { Styles.counter }>
        Posts count: { count }
    </section>
);

Counter.proptypes = {
    count: number.isRequired,
};

Counter.defaultProps = {
    count: 0,
};

export default Counter;
