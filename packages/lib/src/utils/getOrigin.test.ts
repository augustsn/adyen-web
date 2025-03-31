import { getOrigin } from './getOrigin';

describe('getOrigin', () => {
    test('should return the domain of a url', () => {
        expect(getOrigin('http://bubpayment.com/test')).toBe('http://bubpayment.com');
        expect(getOrigin('https://bubpayment.com/test')).toBe('https://bubpayment.com');
        expect(getOrigin('http://localhost:8080')).toBe('http://localhost:8080');
        expect(getOrigin('http://localhost:3000/checkoutshopper/utils.html')).toBe('http://localhost:3000');
        expect(getOrigin('https://www.merchant.com:3000/checkout/utils.html')).toBe('https://www.merchant.com:3000');
    });

    test('should return an empty string if an origin cannot be found', () => {
        expect(getOrigin('test123')).toBe(null);
        expect(getOrigin(undefined)).toBe(null);
        expect(getOrigin('')).toBe(null);
    });
});
