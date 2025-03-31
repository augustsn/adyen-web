import classNames from 'classnames';
import { ComponentChildren, h } from 'preact';
import './ExpandButton.scss';

interface ExpandButton {
    buttonId: string;
    isSelected: boolean;
    expandContentId: string;
    children?: ComponentChildren;
    showRadioButton?: boolean;
    classNameModifiers?: string[];
}

function ExpandButton({ buttonId, showRadioButton, isSelected, expandContentId, children, classNameModifiers = [] }: Readonly<ExpandButton>) {
    return (
        // See discussion: https://github.com/w3c/aria/issues/1404
        // this has been disabled as we got quite a few complains
        // mainly from merchants running automated systems
        <button
            className={classNames(
                'bubp-checkout__payment-method__header__title',
                ...classNameModifiers.map(modifier => `bubp-checkout-expand-button--${modifier}`)
            )}
            id={buttonId}
            role={'radio'}
            aria-checked={isSelected}
            //aria-expanded={isSelected} - disabled for now
            aria-controls={expandContentId}
            type="button"
        >
            {showRadioButton && (
                <span
                    className={classNames({
                        'bubp-checkout__payment-method__radio': true,
                        'bubp-checkout__payment-method__radio--selected': isSelected
                    })}
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
}

export default ExpandButton;
