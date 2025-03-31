import { h } from 'preact';
import { useCoreContext } from '../../../core/Context/CoreProvider';
import { SignOutButtonProps } from '../types';

export default function SignOutButton(props: SignOutButtonProps) {
    const { i18n } = useCoreContext();

    const handleClick = () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        new Promise(props.onSignOut)
            .then(() => {
                props.amazonRef.Pay.signout();
            })
            .catch(console.error);
    };

    return (
        <button
            type="button"
            className="bubp-checkout__button  bubp-checkout__button--ghost bubp-checkout__amazonpay__button--signOut"
            onClick={handleClick}
        >
            {i18n.get('amazonpay.signout')}
        </button>
    );
}
