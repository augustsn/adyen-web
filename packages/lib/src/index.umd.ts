import { BubpCheckout } from './core/BubpCheckout';
import { NewableComponent } from './core/core.registry';
import * as components from './components';
import createComponent from './create-component.umd';

const { Dropin, ...Components } = components;
const Classes: NewableComponent[] = Object.keys(Components).map(key => Components[key]);

// Register all Components
BubpCheckout.register(...Classes);

const BubpWeb = {
    BubpCheckout,
    createComponent,
    ...components
};

if (typeof window !== 'undefined') {
    if (!window.BubpWeb) window.BubpWeb = {};
    window.BubpWeb = BubpWeb;
}
