import getIssuerImage from './get-issuer-image';
import { Resources } from '../core/Context/Resources';

describe('Get issuer image', () => {
    describe('getIssuerImage', () => {
        const issuer = '123';
        const type = 'ideal';
        const loadingContext = 'http://bubpayment.com/';
        const options = { loadingContext };

        const getImage = props => new Resources(loadingContext).getImage(props);

        test('Prepares options when there is an issuer ID', () => {
            expect(getIssuerImage(options, 'ideal', getImage)(issuer)).toBe('http://bubpayment.com/images/logos/ideal/123.svg');
            expect(getIssuerImage(options, 'test', getImage)(issuer)).toBe('http://bubpayment.com/images/logos/test/123.svg');
        });

        test('Prepares options when there is no issuer ID', () => {
            expect(getIssuerImage(options, type, getImage)('')).toBe(null);
        });
    });
});
