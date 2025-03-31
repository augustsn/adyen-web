import { ComponentChildren, h } from 'preact';
import cx from 'classnames';
import './Alert.scss';
import Icon from '../Icon';

const ALERT_TYPES = ['error', 'warning', 'success'];

interface AlertProps {
    children: ComponentChildren;
    classNames?: string[];
    icon?: string;
    type?: (typeof ALERT_TYPES)[number];
}

export default function Alert({ children, classNames = [], type = 'error', icon }: AlertProps) {
    return (
        <div className={cx('bubp-checkout__alert-message', `bubp-checkout__alert-message--${type}`, classNames)}>
            {icon && <Icon className={'bubp-checkout__alert-message__icon'} type={icon} />}
            {children}
        </div>
    );
}
