import { selectOne } from '../components/internal/SecuredFields/lib/utilities/dom';

/**
 * Generic function to set focus on named element
 * @param holder -
 * @param fieldToFocus -
 */
export const setFocusOnField = (holder, fieldToFocus) => {
    const pdHolder = selectOne(document, holder);

    const actualFieldToFocus = fieldToFocus === 'issuer' ? 'issuer-list' : fieldToFocus;

    if (actualFieldToFocus === 'country' || actualFieldToFocus === 'stateOrProvince' || actualFieldToFocus === 'issuer-list') {
        // Set focus on dropdown
        const field: HTMLElement = selectOne(pdHolder, `.bubp-checkout__field--${actualFieldToFocus} .bubp-checkout__filter-input`);
        field?.focus();
    } else {
        // Set focus on input
        const field: HTMLElement = selectOne(pdHolder, `[name="${actualFieldToFocus}"]`);
        field?.focus();
    }
};
