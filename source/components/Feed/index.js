//Core
import React, { Component } from 'react';
import moment from 'moment';

//Components
import Catcher from 'components/Catcher';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';
import { withProfile } from '../HOC/withProfile';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from 'config/api';
import { socket, socketTest } from '../../socket/init';

@withProfile
export default class Feed extends Component {

    constructor () {
        super();

        this._setPostsFetchingState.bind(this);
    }

    state = {
        posts:           [],
        isPostsFetching: false,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserlastName } = this.props;

        this._fetchPosts();
        // this.refetch = setInterval(this._fetchPosts, 1000);
        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (currentUserFirstName + currentUserlastName !== meta.authorFirstName + meta.authorLastName) {
                this.setState(({ posts }) => ({
                    posts: [createdPost, ...posts],
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (currentUserFirstName + currentUserlastName !== meta.authorFirstName + meta.authorLastName) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id === removedPost.id),
                }));
            }
        });
    }

    componentWillUnmount () {
        socket.removeListener('create');
        socket.removeListener('remove');
    }

    _likePost = async (id) => {

        this._setPostsFetchingState(true);

        const response = await fetch(`${api}/${id}`, {
            method:  'PUT',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likedPost } = await response.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likedPost.id ? likedPost : post,
            ),
            isPostsFetching: false,
        }));
    };

    _setPostsFetchingState (state) {
        this.setState({
            isPostsFetching: state,
        });
    }

    _fetchPosts = async () => {
        this._setPostsFetchingState(true);

        const response = await fetch(api, {
            method: 'GET',
        });

        const { data: posts } = await response.json();

        console.log('POSTS', posts);

        this.setState({
            posts,
            isPostsFetching: false,
        });
    };

    _createPost = async (comment) => {

        this._setPostsFetchingState(true);

        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ comment }),
        });

        const { data: post } = await response.json();

        this.setState(({ posts }) => ({
            posts:           [post, ...posts],
            isPostsFetching: false,
        }));
    };

    _removePost = async (id) => {
        this._setPostsFetchingState(true);

        await fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState(({ posts }) => ({
            posts:           posts.filter((post) => post.id !== id),
            isPostsFetching: false,
        }));
    }

    render () {
        const { posts, isPostsFetching } = this.state;

        console.log('render posts', posts);

        const postsJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        { ...post }
                        _likePost = { this._likePost }
                        _removePost = { this._removePost }
                    />
                </Catcher>
            );
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
