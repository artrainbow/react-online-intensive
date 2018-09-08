// Core
import { sum, delay, getUniqueID, getFullApiUrl } from './index';

jest.setTimeout(5001); // Otherwise test of delay(5000) function invoke an exception;

describe('Instruments', () => {
    test('sum must be a function.', () => {
        expect(sum).toBeInstanceOf(Function);
    });

    test('sum should return sum of two args ', () => {
        expect(sum(2, 4)).toBe(6);
        expect(sum(1, 9)).toMatchSnapshot();
    });

    test('sum should return exception if some argument not a number', () => {
        expect(() => sum(2, 'hello')).toThrow();
        expect(() => sum('hello', 2)).toThrow();
        expect(() => sum('hello', 'world')).toThrow();
    });

    test('delay must be a function.', () => {
        expect(delay).toBeInstanceOf(Function);
    });

    test('delay should return a resolved promise', async () => {
        await expect(delay()).resolves.toBeUndefined();
    });

    test('getUniqueID must be a function', () => {
        expect(getUniqueID).toBeInstanceOf(Function);
    });

    test('getUniqueID should return exception if some argument not a number', () => {
        expect(() => getUniqueID('hello')).toThrow();
        expect(() => getUniqueID(true)).toThrow();
        expect(() => getUniqueID(null)).toThrow();
    });

    test('getUniqueID should return string', () => {
        expect(typeof getUniqueID(3)).toBe('string');
    });

    test('getUniqueID should return string with length equals args length', () => {
        expect(getUniqueID(3).length).toBe(3);
        expect(getUniqueID(12)).toHaveLength(12);
    });

    test('getFullApiUrl must be a function', () => {
        expect(getFullApiUrl).toBeInstanceOf(Function);
    });

    test('getFullApiUrl should takes 2 arguments and return exception if some argument not a string', () => {
        expect(()=> getFullApiUrl(777, 'test')).toThrow();
        expect(()=> getFullApiUrl('test')).toThrow();
        expect(()=> getFullApiUrl(777)).toThrow();
    });

    test('getFullApiUrl should return string', () => {
        expect(typeof getFullApiUrl('test', 'test')).toBe('string');
    });
});
