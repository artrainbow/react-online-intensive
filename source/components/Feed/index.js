//Core
import React, { Component } from 'react';
import moment from 'moment';

//Components
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';
import { withProfile } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from '../../instruments';

@withProfile
export default class Feed extends Component {

    state = {
        posts: [
            {
                id:      '1',
                comment: 'Hi there!',
                created: 1526825076849,
                likes:   [],
            },
            {
                id:      '2',
                comment: 'Yo!',
                created: 1526825076855,
                likes:   [],
            }
        ],
        isPostsFetching: false,
    };

    _likePost = async (id) => {
        const { currentUserFirstName, currentUserLastName } = this.props;

        this._setPostsFetchingState(true);

        await delay(1200);

        const newPosts = this.state.posts.map((post) => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: [
                        {
                            id:        getUniqueID(),
                            firstName: currentUserFirstName,
                            lastName:  currentUserLastName,
                        }
                    ],
                };
            }

            return post;
        });

        this.setState({
            posts:           newPosts,
            isPostsFetching: false,
        });
    };

    _setPostsFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    };

    _createPost = async (comment) => {

        this._setPostsFetchingState(true);

        const post = {
            id:      getUniqueID(),
            created: moment().utc(),
            comment,
            likes:   [],
        };

        await delay(1200);

        this.setState(({ posts }) => ({
            posts:           [post, ...posts],
            isPostsFetching: false,
        }));
    };

    _removePost = async (id) => {
        this._setPostsFetchingState(true);

        await delay(1200);
        this.setState(({ posts }) => ({
            posts:           posts.filter((post) => post.id !== id),
            isPostsFetching: false,
        }));
    }

    render () {
        const { posts, isPostsFetching } = this.state;
        const postsJSX = posts.map((post) => {
            return (<Post
                { ...post }
                _likePost = { this._likePost }
                _removePost = { this._removePost }
                key = { post.id }
            />);
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isPostsFetching } />
                <StatusBar />
                <Composer _createPost = { this._createPost } />
                {postsJSX}
            </section>
        );
    }
}
