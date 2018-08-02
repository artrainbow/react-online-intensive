//Core
import React, { Component } from 'react';

// Instruments
import avatar from 'theme/assets/lisa';

export default class Composer extends Component {
    render () {
        return (
            <section>
                <img src = { avatar } />
                <form action = ''>
                    <textarea placeholder = { `What's on your mind, Lisa? ` } />
                    <input type = 'submit' value = 'Post' />
                </form>
            </section>
        );
    }
}
