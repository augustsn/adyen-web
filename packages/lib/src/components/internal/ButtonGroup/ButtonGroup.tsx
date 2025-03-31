import cx from 'classnames';
import './ButtonGroup.scss';
import { h } from 'preact';

const ButtonGroup = ({ options = [], name, onChange }) => (
    <div className="bubp-checkout__button-group">
        {options.map(({ label, selected, value, disabled }, index) => (
            <label
                key={`${name}${index}`}
                className={cx({
                    'bubp-checkout__button': true,
                    'bubp-checkout__button--selected': selected,
                    'bubp-checkout__button--disabled': disabled
                })}
            >
                <input
                    type="radio"
                    className="bubp-checkout__button-group__input"
                    value={value}
                    checked={selected}
                    onChange={onChange}
                    disabled={disabled}
                />
                <span className="bubp-checkout__button-text">{label}</span>
            </label>
        ))}
    </div>
);

export default ButtonGroup;
