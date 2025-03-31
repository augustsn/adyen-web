import { useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { createCheckout } from '../helpers/create-checkout';
import { GlobalStoryProps } from './types';
import { ICore } from '../../src/core/types';
import Spinner from '../../src/components/internal/Spinner';

interface ICheckout {
    children: (checkout: ICore) => ComponentChildren | void;
    checkoutConfig: GlobalStoryProps;
}

export const Checkout = ({ children, checkoutConfig }: ICheckout) => {
    const [bubpCheckout, setBubpCheckout] = useState<ICore>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        createCheckout(checkoutConfig)
            .then(checkout => {
                setBubpCheckout(checkout);
            })
            .catch(e => {
                console.error(e);
                setErrorMessage('Initialize checkout failed.');
            });
    }, [checkoutConfig]);

    return (
        <>
            {errorMessage && <div>{errorMessage}</div>}
            {bubpCheckout ? children(bubpCheckout) : <Spinner />}
        </>
    );
};
