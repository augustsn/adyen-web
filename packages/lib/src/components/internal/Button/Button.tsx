import { Component, h } from 'preact';
import classNames from 'classnames';
import Spinner from '../Spinner';
import { useCoreContext } from '../../../core/Context/CoreProvider';
import './Button.scss';
import { ButtonProps, ButtonState } from './types';

class Button extends Component<ButtonProps, ButtonState> {
    public static defaultProps = {
        status: 'default',
        variant: 'primary',
        disabled: false,
        label: '',
        inline: false,
        target: '_self',
        onClick: () => {}
    };

    public onClick = e => {
        e.preventDefault();

        if (!this.props.disabled) {
            this.props.onClick(e, { complete: this.complete });
        }
    };

    public complete = (delay = 1000) => {
        this.setState({ completed: true });
        setTimeout(() => {
            this.setState({ completed: false });
        }, delay);
    };

    public onKeyDown = (event: KeyboardEvent) => {
        this.props.onKeyDown?.(event);
    };

    render({ classNameModifiers = [], disabled, href, icon, inline, label, status, variant }, { completed }) {
        const { i18n } = useCoreContext();

        const buttonIcon = icon ? <img className="bubp-checkout__button__icon" src={icon} alt="" aria-hidden="true" /> : '';

        const modifiers = [
            ...classNameModifiers,
            ...(variant !== 'primary' ? [variant] : []),
            ...(inline ? ['inline'] : []),
            ...(completed ? ['completed'] : []),
            ...(status === 'loading' || status === 'redirect' ? ['loading'] : [])
        ];

        const buttonClasses = classNames(['bubp-checkout__button', ...modifiers.map(m => `bubp-checkout__button--${m}`)]);

        const buttonStates = {
            loading: (
                <span className="bubp-checkout__button__content">
                    <Spinner size="medium" inline />
                    <span className={'bubp-checkout__button__text--sr-only'}>{i18n.get('loading')}</span>
                </span>
            ),
            redirect: (
                <span className="bubp-checkout__button__content">
                    <Spinner size="medium" inline />
                    {i18n.get('payButton.redirecting')}
                </span>
            ),
            default: (
                <span className="bubp-checkout__button__content">
                    {buttonIcon}
                    <span className="bubp-checkout__button__text">{label}</span>
                </span>
            )
        };

        const buttonText = buttonStates[status] || buttonStates.default;

        if (href) {
            return (
                <a className={buttonClasses} href={href} disabled={disabled} target={this.props.target} rel={this.props.rel}>
                    {buttonText}
                </a>
            );
        }

        return (
            <button className={buttonClasses} type="button" disabled={disabled} onClick={this.onClick} onKeyDown={this.onKeyDown}>
                {buttonText}
                {status !== 'loading' && status !== 'redirect' && this.props.children}
            </button>
        );
    }
}

export default Button;
