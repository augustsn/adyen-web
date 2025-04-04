/**
 * FALLBACK_CONTEXT
 */
export const FALLBACK_CONTEXT = 'https://bubpayment.com/checkout/shopper/';

export const GENERIC_OPTIONS = [
    'amount',
    'secondaryAmount',
    'countryCode',
    'environment',
    '_environmentUrls',
    'loadingContext',
    'i18n',
    'modules',
    'order',
    'session',
    'clientKey',
    'showPayButton',
    'redirectFromTopWhenInIframe',

    // Events
    'onPaymentCompleted',
    'onPaymentFailed',
    'beforeRedirect',
    'beforeSubmit',
    'onSubmit',
    'onActionHandled',
    'onAdditionalDetails',
    'onChange',
    'onEnterKeyPressed',
    'onError',
    'onBalanceCheck',
    'onOrderCancel',
    'onOrderRequest',
    'onOrderUpdated',
    'onPaymentMethodsRequest'
];

export const DEFAULT_HTTP_TIMEOUT = 60000;

export default {
    FALLBACK_CONTEXT,
    GENERIC_OPTIONS,
    DEFAULT_HTTP_TIMEOUT
};
