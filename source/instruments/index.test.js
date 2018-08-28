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

    test('getUniqueID must be a function.', () => {
        expect(getUniqueID).toBeInstanceOf(Function);
    });
});
