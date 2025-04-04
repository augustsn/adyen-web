import { Base } from './base';
import { Locator, Page } from '@playwright/test';

class BacsDirectDebit extends Base {
    private readonly rootElementSelector = '.bubp-checkout__bacs';
    private readonly rootElement: Locator;

    constructor(page: Page) {
        super(page);
        this.rootElement = page.locator(this.rootElementSelector);
    }

    get bankAccountHolderNameInput() {
        return this.rootElement.getByRole('textbox', { name: /bank account holder name/i });
    }

    get bankAccountNumberInput() {
        return this.rootElement.getByRole('textbox', { name: /bank account number/i });
    }

    get sortCodeInput() {
        return this.rootElement.getByRole('textbox', { name: /sort code/i });
    }

    get emailAddressInput() {
        return this.rootElement.getByRole('textbox', { name: /email address/i });
    }

    get consentCheckbox() {
        return this.rootElement.locator('.bubp-checkout__field--consentCheckbox').filter({ hasText: /i agree that the above amount/i });
    }

    get accountConsentCheckbox() {
        return this.rootElement
            .locator('.bubp-checkout__field--consentCheckbox')
            .filter({ hasText: /i confirm the account is in my name and i am the only signatory/i });
    }

    get continueButton() {
        return this.rootElement.getByRole('button', { name: /continue/i });
    }

    get downloadPdfButton() {
        return this.page.locator('.bubp-checkout__voucher-result--directdebit_GB').getByRole('link', { name: /download pdf/i });
    }
}

export default BacsDirectDebit;
