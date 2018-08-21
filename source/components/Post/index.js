//Core
import React, { Component } from 'react';
import moment from 'moment';
import { func, string, number, array } from 'prop-types';

// Components
import Like from 'components/Like';
import { withProfile } from 'components/HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

@withProfile
export default class Post extends Component {
    static propTypes = {
        _likePost:   func.isRequired,
        _removePost: func.isRequired,
        comment:     string.isRequired,
        created:     number.isRequired,
        id:          string.isRequired,
        likes:       array.isRequired,
    };

    _handleRemovePost = () => {
        this.props._removePost(this.props.id);
    };

    _getCross = () => {
        const {
            firstName,
            lastName,
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        return firstName + lastName === currentUserFirstName + currentUserLastName ?
            <span className = { Styles.cross } onClick = { this._handleRemovePost } /> :
            null;
    }

    render () {
        const {
            comment,
            created,
            _likePost,
            id,
            likes,
            avatar,
            firstName,
            lastName,
        } = this.props;

        const getCross = this._getCross();

        return (
            <section className = { Styles.post }>
                {getCross}
                <img src = { avatar } />
                <a>{`${firstName} ${lastName}`}</a>
                <time>{moment.unix(created).format('MMMM D h:mm:ss a')}</time>
                <p>{comment}</p>
                <Like
                    _likePost = { _likePost }
                    id = { id }
                    likes = { likes }
                    { ...this.props }
                />
            </section>
        );
    }
}
