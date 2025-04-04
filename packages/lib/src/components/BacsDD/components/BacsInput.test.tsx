/** @tsx h */
import { h } from 'preact';
import { mount } from 'enzyme';
import BacsInput from './BacsInput';
import { BacsInputProps } from './types';
import { mock } from 'jest-mock-extended';
import { CoreProvider } from '../../../core/Context/CoreProvider';

const defaultProps = {
    onChange: () => {},
    onSubmit: () => {}
};
const bacsPropsMock = mock<BacsInputProps>();
const getWrapper = (props = {}) =>
    mount(
        <CoreProvider i18n={global.i18n} loadingContext="test" resources={global.resources}>
            <BacsInput {...defaultProps} {...props} {...bacsPropsMock} />{' '}
        </CoreProvider>
    );

describe('BacsInput', () => {
    test('Should display expected fields for opening (enter-data) state', () => {
        const wrapper = getWrapper({});

        // Main holder
        expect(wrapper.find('.bubp-checkout__bacs')).toHaveLength(1);

        // Name (active)
        expect(wrapper.find('div.bubp-checkout__bacs--holder-name')).toHaveLength(1);
        expect(wrapper.find('div.bubp-checkout__bacs--holder-name.bubp-checkout__field--inactive')).toHaveLength(0);

        // Holder for account & location + account & location fields
        expect(wrapper.find('.bubp-checkout__bacs .bubp-checkout__bacs__num-id')).toHaveLength(1);
        expect(wrapper.find('div.bubp-checkout__bacs--bank-account-number')).toHaveLength(1);
        expect(wrapper.find('div.bubp-checkout__bacs--bank-location-id')).toHaveLength(1);

        // Email
        expect(wrapper.find('div.bubp-checkout__bacs--shopper-email')).toHaveLength(1);

        // Consent checkboxes
        expect(wrapper.find('ConsentCheckbox')).toHaveLength(2);
    });

    test('Should display expected fields for second (confirm-data) state', () => {
        const wrapper = getWrapper({});

        wrapper.find('BacsInput').instance().setStatus('confirm-data');
        wrapper.update();

        // Main holder (with additional 'confim' class)
        expect(wrapper.find('.bubp-checkout__bacs.bubp-checkout__bacs--confirm')).toHaveLength(1);

        // Edit button
        expect(wrapper.find('.bubp-checkout__bacs .bubp-checkout__bacs--edit')).toHaveLength(1);

        // Name (inactive)
        expect(wrapper.find('div.bubp-checkout__bacs--holder-name.bubp-checkout__field--inactive')).toHaveLength(1);

        // Holder for account & location + inactive account & location fields
        expect(wrapper.find('.bubp-checkout__bacs .bubp-checkout__bacs__num-id')).toHaveLength(1);
        expect(wrapper.find('div.bubp-checkout__bacs--bank-account-number.bubp-checkout__field--inactive')).toHaveLength(1);
        expect(wrapper.find('div.bubp-checkout__bacs--bank-location-id.bubp-checkout__field--inactive')).toHaveLength(1);

        // Email (inactive)
        expect(wrapper.find('div.bubp-checkout__bacs--shopper-email.bubp-checkout__field--inactive')).toHaveLength(1);

        // No consent checkboxes
        expect(wrapper.find('ConsentCheckbox')).toHaveLength(0);
    });
});
