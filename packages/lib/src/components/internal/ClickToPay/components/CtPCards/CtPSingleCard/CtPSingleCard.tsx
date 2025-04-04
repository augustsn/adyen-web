import { Fragment, h } from 'preact';
import classnames from 'classnames';
import Img from '../../../../Img';
import ShopperCard from '../../../models/ShopperCard';
import { useCoreContext } from '../../../../../../core/Context/CoreProvider';
import useImage from '../../../../../../core/Context/useImage';
import './CtPSingleCard.scss';

type CtPSingleCardProps = {
    card: ShopperCard;
    errorMessage?: string;
};

const CtPSingleCard = ({ card, errorMessage }: CtPSingleCardProps) => {
    const { i18n } = useCoreContext();
    const getImage = useImage();
    const cardImage = card.artUri || getImage()(card.scheme);

    return (
        <Fragment>
            <div className="bubp-checkout-ctp__card-list-single-card">
                <Img src={cardImage} height={24} className={'bubp-checkout-ctp__card-image'} />

                <span className={classnames({ 'bubp-checkout-ctp__card-list-single-card-expired': card.isExpired })}>
                    {card.title} {`•••• ${card.panLastFour}`}
                </span>

                {card.isExpired && <span className="bubp-checkout-ctp__expired-label">{i18n.get('ctp.cards.expiredCard')}</span>}
            </div>

            {errorMessage && <div className="bubp-checkout-contextual-text--error">{errorMessage}</div>}
        </Fragment>
    );
};

export default CtPSingleCard;
