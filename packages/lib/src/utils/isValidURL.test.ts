import { isValidHttpUrl } from './isValidURL';

describe('isValidHttpUrl', () => {
    test('https url is valid', () => {
        expect(isValidHttpUrl('https://bubpayment.com')).toEqual(true);
    });
    test('http url is not valid', () => {
        expect(isValidHttpUrl('http://bubpayment.com')).toEqual(false);
    });
    test('http url is valid when config arg is passed', () => {
        expect(isValidHttpUrl('http://bubpayment.com', true)).toEqual(true);
    });
    test('url without https is not valid', () => {
        expect(isValidHttpUrl('bubpayment.com')).toEqual(false);
    });
    test('random string is not valid', () => {
        expect(isValidHttpUrl('blahblahblah')).toEqual(false);
    });
});
