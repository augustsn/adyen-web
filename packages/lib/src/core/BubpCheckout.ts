import Core from './core';
import { UIElement } from '../types';
import type { CoreConfiguration, ICore } from './types';

async function BubpCheckout(props: CoreConfiguration): Promise<Core> {
    const checkout = new Core(props);
    return await checkout.initialize();
}

BubpCheckout.register = (...items: (new (checkout: ICore, props) => UIElement)[]) => {
    Core.register(...items);
};

/**
 * Function used by the 'auto' package to insert its bundle type information in the Core.
 * We can't inject its bundle type when bundling with Rollup (as done with the other bundle types), since 'auto' uses ES-LEGACY bundle type under the hood.
 */
BubpCheckout.setBundleType = (type: string) => {
    Core.setBundleType(type);
};

export { BubpCheckout };
