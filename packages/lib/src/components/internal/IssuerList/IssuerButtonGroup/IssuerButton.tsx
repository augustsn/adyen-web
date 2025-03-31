import { h } from 'preact';
import cx from 'classnames';
import Img from '../../Img';
import './IssuerButton.scss';

interface IssuerButtonProps {
    name: string;
    id: string;
    selected: boolean;
    onClick: (event: UIEvent) => void;
    icon?: string;
}

function IssuerButton({ name, id, icon, onClick, selected = false }: IssuerButtonProps) {
    return (
        <button
            type="button"
            className={cx('bubp-checkout__issuer-button', { 'bubp-checkout__issuer-button--selected': selected })}
            aria-label={name}
            aria-pressed={selected}
            onClick={onClick}
            value={id}
        >
            {!!icon && <Img className="bubp-checkout__issuer-button-img" alt={name} src={icon} />}
            <span className="bubp-checkout__issuer-button-text">{name}</span>
        </button>
    );
}

export default IssuerButton;
