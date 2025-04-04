import { Fragment, h } from 'preact';
import { useCoreContext } from '../../../core/Context/CoreProvider';

interface ConsentCheckboxLabelProps {
    url: string;
}

export default function ConsentCheckboxLabel(props: ConsentCheckboxLabelProps) {
    const { i18n } = useCoreContext();
    const linkText = i18n.get('paymentConditions');
    const translationString = i18n.get('afterPay.agreement');
    const [textBeforeLink, textAfterLink] = translationString.split('%@');

    if (textBeforeLink && textAfterLink) {
        return (
            <Fragment>
                {textBeforeLink}
                <a className="bubp-checkout-link" target="_blank" rel="noopener noreferrer" href={props.url}>
                    {linkText}
                </a>
                {textAfterLink}
            </Fragment>
        );
    }

    return <span className="bubp-checkout__checkbox__label">{i18n.get('privacyPolicy')}</span>;
}
