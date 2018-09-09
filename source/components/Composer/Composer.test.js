// Core
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Composer } from './'; // hack for components with HOC

configure({ adapter: new Adapter() }); // данный конфиг можно использовать на глоальном уровне в файле jest.test.config.json на строке setupTestFrameworkScriptFile где указано что данный файл удет запускаться перед каждым тестом

const props = {
    _createPost: jest.fn(),
};

const comment = 'Merry christmas';

const initialState = {
    comment: '',
};

const updateState = {
    comment,
};

const result = mount(<Composer { ...props } />);

const _submitCommentSpy = jest.spyOn(result.instance(), '_submitComment');
const _handleFormSubmitSpy = jest.spyOn(result.instance(), '_handleFormSubmit');

describe('Composer component', () => {
    test('should have 1 section element', () => {
        expect(result.find('section').length).toBe(1);
        expect(result.find('section')).toHaveLength(1);
    });

    test('should have 1 form element', () => {
        expect(result.find('form')).toHaveLength(1);
    });

    test('should have 1 textarea element', () => {
        expect(result.find('textarea')).toHaveLength(1);
    });

    test('should have 1 input element', () => {
        expect(result.find('input')).toHaveLength(1);
    });

    test('should have 1 img element', () => {
        expect(result.find('img')).toHaveLength(1);
    });

    test('should have valid initial state', () => {
        expect(result.state()).toEqual(initialState);
    });

    test('should have valid text node', () => {
        expect(result.find('textarea').text()).toEqual(initialState.comment);
        expect(result.find('textarea').text()).toBe('');
    });

    test('should respond to state change properly', () => {
        result.setState({
            comment,
        });
        expect(result.state()).toEqual(updateState);
        expect(result.find('textarea').text()).toBe(comment);

        result.setState({
            comment: '',
        });

        expect(result.state()).toEqual(initialState);
        expect(result.find('textarea').text()).toBe('');
    });

    test('should handle textarea change event', () => {
        result.find('textarea').simulate('change', {
            target: {
                value: comment,
            },
        });

        expect(result.find('textarea').text()).toBe(comment);
        expect(result.state()).toEqual(updateState);
    });

    test('should handle form submit event', () => {
        result.find('form').simulate('submit');

        expect(result.state()).toEqual(initialState);
    });

    test('_createPost method in props should be invoked after submit event', () => {
        expect(props._createPost.mock.calls.length).toBe(1);
        expect(props._createPost).toHaveBeenCalled();
        expect(props._createPost).toHaveBeenCalledTimes(1);
    });

    test('_submitComment and _handleFormSubmit methods should be invoked once after form was submitted', () => {
        expect(_submitCommentSpy).toHaveBeenCalledTimes(1);
        expect(_handleFormSubmitSpy).toHaveBeenCalledTimes(1);

    });
});
