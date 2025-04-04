import { h } from 'preact';
import classNames from 'classnames';
import { App } from '../../types';
import UPIIntentAppItem from './UPIIntentAppItem';
import VpaInput from '../VpaInput';
import { OnChangeProps, VpaInputHandlers } from '../VpaInput/VpaInput';
import useImage from '../../../../core/Context/useImage';
import './UPIIntentAppList.scss';
import { useCoreContext } from '../../../../core/Context/CoreProvider';

interface UPIIntentAppListProps {
    apps: Array<App>;
    selectedAppId?: string;
    disabled?: boolean;
    onAppSelect?: Function;
    onVpaInputChange?({ data, valid, errors, isValid }: OnChangeProps): void;
    onSetInputHandlers?(handlers: VpaInputHandlers): void;
}

const UPIIntentAppList = ({
    apps,
    selectedAppId,
    disabled,
    onAppSelect = () => {},
    onVpaInputChange = () => {},
    onSetInputHandlers = () => {}
}: UPIIntentAppListProps): h.JSX.Element => {
    const { i18n } = useCoreContext();
    const getImage = useImage();

    return (
        /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
        <ul
            className={classNames({
                'bubp-checkout-upi-app-list': true,
                'bubp-checkout-upi-app-list--loading': disabled
            })}
            role="radiogroup"
            aria-label={i18n.get('paymentMethodsList.aria.label')}
            required
        >
            {apps.map(app => {
                const key = `bubp-checkout-upi-app-item-${app.id}}`;
                const isSelected = selectedAppId === app.id;

                const showUpiCollectInput = app.id === 'vpa';
                const imgName = showUpiCollectInput ? 'upi' : `upi/${app.id}`;
                const imgSrc = getImage()(imgName.toLowerCase());

                return (
                    <UPIIntentAppItem key={key} app={app} imgSrc={imgSrc} isSelected={isSelected} onSelect={onAppSelect}>
                        {showUpiCollectInput && <VpaInput disabled={disabled} onChange={onVpaInputChange} onSetInputHandlers={onSetInputHandlers} />}
                    </UPIIntentAppItem>
                );
            })}
        </ul>
    );
};

export default UPIIntentAppList;
