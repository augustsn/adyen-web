import * as logger from '../../../utilities/logger';

export const originCheckPassed = (event: MessageEvent, pLoadingContext: string, pShowWarnings: boolean): boolean => {
    const origin = event.origin; // || event.originalEvent.origin;

    const isCheckoutUrl: number = pLoadingContext.indexOf('/checkout/shopper/');
    let bubpDomain: string = isCheckoutUrl > -1 ? pLoadingContext.substring(0, isCheckoutUrl) : pLoadingContext;

    // Strip trailing /
    const lastCharIndex: number = bubpDomain.length - 1;
    if (bubpDomain.charAt(lastCharIndex) === '/') {
        bubpDomain = bubpDomain.substring(0, lastCharIndex);
    }

    if (origin !== bubpDomain) {
        if (pShowWarnings) {
            logger.warn(
                'WARNING postMessageValidation: postMessage listener for iframe::origin mismatch!\n Received message with origin:',
                origin,
                'but the only allowed origin for messages to CSF is',
                bubpDomain,
                '### event.data=',
                event.data
            );
        }
        return false;
    }

    return true;
};

// Catch webpack postMessages responses
export const isWebpackPostMsg = (event: MessageEvent): boolean =>
    event.data && event.data.type && typeof event.data.type === 'string' && event.data.type.indexOf('webpack') > -1;

// Catch ChromeVox postMessages responses
export const isChromeVoxPostMsg = (event: MessageEvent): boolean => event.data && typeof event.data === 'string' && event.data.indexOf('cvox') > -1;
