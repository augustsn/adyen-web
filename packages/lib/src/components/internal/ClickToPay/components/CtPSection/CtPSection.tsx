import { h } from 'preact';
import classnames from 'classnames';
import CtPLogoutLink from './CtPLogoutLink';
import { CtPBrand } from '../CtPBrand';
import useClickToPayContext from '../../context/useClickToPayContext';
import './CtPSection.scss';

interface CtPSectionProps {
    onEnterKeyPress: (event: h.JSX.TargetedKeyboardEvent<HTMLInputElement>) => void;
    children?: h.JSX.Element[];
}

const CtPSection = ({ children, onEnterKeyPress }: CtPSectionProps): h.JSX.Element => {
    const { isStandaloneComponent } = useClickToPayContext();

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={classnames('bubp-checkout-ctp__section', { 'bubp-checkout-ctp__section--standalone': isStandaloneComponent })}
            onKeyPress={onEnterKeyPress}
        >
            <div className="bubp-checkout-ctp__section-brand">
                <CtPBrand />
                <CtPLogoutLink />
            </div>

            {children}
        </div>
    );
};

const Title = ({ endAdornment, children }: { endAdornment?; children }) => (
    <div className="bubp-checkout-ctp__section-header">
        <h1 className="bubp-checkout-ctp__section-header-title">{children}</h1>
        {endAdornment && <span className="bubp-checkout-ctp__section-header-adornment">{endAdornment}</span>}
    </div>
);
const Text = ({ children }: { children }) => <p className="bubp-checkout-ctp__section-text">{children}</p>;

CtPSection.Title = Title;
CtPSection.Text = Text;

export default CtPSection;
