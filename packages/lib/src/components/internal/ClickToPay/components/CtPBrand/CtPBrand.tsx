import { h } from 'preact';
import classnames from 'classnames';
import Img from '../../../Img';
import { SchemeNames } from '../../services/sdks/utils';
import useClickToPayContext from '../../context/useClickToPayContext';
import useImage from '../../../../../core/Context/useImage';
import './CtPBrand.scss';

type CtPBrandProps = {
    classNameModifiers?: string[];
};

const CtPBrand = ({ classNameModifiers = [] }: CtPBrandProps) => {
    const getImage = useImage();
    const { schemes } = useClickToPayContext();

    const ctpImageUrl = getImage()('ctp');
    const pipeImageUrl = getImage({ imageFolder: 'components/' })('pipe');

    return (
        <div
            className={classnames(
                'bubp_checkout-ctp__brand-wrapper',
                classNameModifiers.map(m => `bubp_checkout-ctp__brand-wrapper--${m}`)
            )}
        >
            <Img className="bubp_checkout-ctp__brand-logo" src={ctpImageUrl} alt={'Logo of Click to Pay'} />
            <Img className="bubp_checkout-ctp__brand-pipe" src={pipeImageUrl} alt="" />

            {schemes.map(brand => (
                <Img
                    key={brand}
                    className={classnames('bubp_checkout-ctp__brand-scheme', `bubp_checkout-ctp__brand-scheme-${brand}`)}
                    src={getImage()(brand)}
                    alt={`Logo of ${SchemeNames[brand]}`}
                />
            ))}
        </div>
    );
};

export { CtPBrand };
