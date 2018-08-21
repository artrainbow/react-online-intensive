//Core
import React, { Component } from 'react';
import { object } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Catcher extends Component {
    static propTypes = {
        children: object.isRequired,
    };

    state = {
        error: false,
    };
    componentDidCatch (error, stack) {
        console.log('error', error);
        console.log('stack', stack.componentStack);

        this.setState({
            error: true,
        });
    }

    render () {
        if (this.state.error) {
            return (
                <section className = { Styles.catcher }>
                    <span> A mysterious error occured! </span>
                </section>
            );

        }

        return this.props.children;
    }
}
