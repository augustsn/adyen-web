import { h, ComponentChildren } from 'preact';
import cx from 'classnames';
import { useCoreContext } from '../../../../core/Context/CoreProvider';
import './Fieldset.scss';
import { getUniqueId } from '../../../../utils/idGenerator';

interface FieldsetProps {
    children: ComponentChildren;
    classNameModifiers: string[];
    label?: string;
    description?: string;
    readonly?: boolean;
}

export default function Fieldset({ children, classNameModifiers = [], label, readonly = false, description }: FieldsetProps) {
    const { i18n } = useCoreContext();

    const describedById = getUniqueId('payid-input-description');

    return (
        <fieldset
            className={cx([
                'bubp-checkout__fieldset',
                ...classNameModifiers.map(m => `bubp-checkout__fieldset--${m}`),
                { 'bubp-checkout__fieldset--readonly': readonly }
            ])}
            aria-describedby={description ? describedById : null}
        >
            {label && <legend className="bubp-checkout__fieldset__title">{i18n.get(label)}</legend>}
            {description && (
                <p id={describedById} className="bubp-checkout__fieldset__description">
                    {i18n.get(description)}
                </p>
            )}
            <div className="bubp-checkout__fieldset__fields">{children}</div>
        </fieldset>
    );
}
