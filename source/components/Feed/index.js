//Core
import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import { TweenMax } from 'gsap';

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
import { socket } from '../../socket/init';

@withProfile
export default class Feed extends Component {

    state = {
        posts:           [],
        isPostsFetching: false,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserlastName } = this.props;

        this._fetchPosts();
        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserlastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: [createdPost, ...posts],
                }));
            }
        });

        // socket.on('remove', (postJSON) => {
        //     const { data: removedPost, meta } = JSON.parse(postJSON);
        //     console.log(meta);
        //     if (`${currentUserFirstName} ${currentUserlastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
        //         this.setState(({ posts }) => ({
        //             posts: posts.filter((post) => post.id !== removedPost.id),
        //         }));
        //     }
        // });

        //
        // socket.on('like', (postJSON) => {
        //     const { data: likedPost, meta } = JSON.parse(postJSON);
        //     console.log('like', JSON.parse(postJSON));
        //     if (currentUserFirstName + currentUserlastName !== meta.authorFirstName + meta.authorLastName) {
        //         this.setState(({ posts }) => ({
        //             posts: posts.map((post) => post.id === likedPost.id ? likedPost : post),
        //         }));
        //     }
        // });
    }

    componentWillUnmount () {
        socket.removeListener('create');
        // socket.removeListener('remove');
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

    _setPostsFetchingState = (state) => {
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

    _animateComposeEnter = (composer) =>{
        console.log(composer);
    }

    render () {
        const { posts, isPostsFetching } = this.state;

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
                <Transition
                    appear
                    in
                    timeout = { 1000 }
                    onEnter = { this._animateComposeEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                {postsJSX}
            </section>
        );
    }
}
