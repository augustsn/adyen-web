import { h } from 'preact';
import cx from 'classnames';
import { SelectItemProps } from '../types';
import Img from '../../../Img';
import Icon from '../../../Icon';
import { PREFIX } from '../../../Icon/constants';

const SelectListItem = ({ item, active, selected, ...props }: SelectItemProps) => {
    return (
        /* eslint-disable jsx-a11y/click-events-have-key-events  */
        <li
            aria-disabled={!!item.disabled}
            aria-selected={selected}
            className={cx([
                'bubp-checkout__dropdown__element',
                {
                    'bubp-checkout__dropdown__element--active': active,
                    'bubp-checkout__dropdown__element--disabled': !!item.disabled
                }
            ])}
            // A change in Preact v10.11.1 means that all falsy values are assessed and set on data attributes.
            // In the case of data-disabled we only ever want it set if item.disabled is actually true, since the presence of the data-disabled attr,
            // regardless of its value, will disable the select list item
            data-disabled={item.disabled === true ? true : null}
            data-value={item.id}
            onClick={props.onSelect}
            onMouseEnter={props.onHover}
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */
            role="option"
            //tabIndex={-1}
            id={`listItem-${item.id}`}
        >
            {item.icon && <Img className="bubp-checkout__dropdown__element__icon" alt={item.name} src={item.icon} />}
            <span className="bubp-checkout__dropdown__element__text">{item.name}</span>
            {item.secondaryText && <span className="bubp-checkout__dropdown__element__secondary-text">{item.secondaryText}</span>}
            {selected && <Icon type={`${PREFIX}checkmark`} height={14} width={14} />}
        </li>
    );
};

export default SelectListItem;
