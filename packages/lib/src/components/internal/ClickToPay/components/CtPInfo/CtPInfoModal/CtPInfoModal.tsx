import { Fragment, h } from 'preact';
import { useRef } from 'preact/hooks';
import { CtPBrand } from '../../CtPBrand';
import { useCoreContext } from '../../../../../../core/Context/CoreProvider';
import useImage from '../../../../../../core/Context/useImage';
import { Modal } from '../../../../Modal';
import Img from '../../../../Img';
import Button from '../../../../Button';
import './CtPInfoModal.scss';

let idGenerator = Date.now();

function getUniqueId() {
    idGenerator += 1;
    return `bubp-${idGenerator}`;
}

type CtPInfoModalProps = {
    isOpen: boolean;
    onClose(): void;
    focusAfterClose: HTMLElement;
};

const CtPInfoModal = ({ isOpen, onClose, focusAfterClose }: CtPInfoModalProps) => {
    const focusFirstElement = useRef<HTMLParagraphElement>();
    const { i18n } = useCoreContext();
    const getImage = useImage();

    const labelledBy = getUniqueId();
    const describedBy = getUniqueId();

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            classNameModifiers={['ctp']}
            labelledBy={labelledBy}
            describedBy={describedBy}
            focusFirst={focusFirstElement.current}
            focusAfterClose={focusAfterClose}
        >
            {({ onCloseModal }) => (
                <Fragment>
                    <Img className="bubp-checkout__ctp-modal-header-image" src={getImage({ imageFolder: 'components/' })('ctp_landscape')} alt="" />
                    <h1 id={labelledBy} className="bubp-checkout__ctp-modal-title">
                        {i18n.get('ctp.infoPopup.title')}
                    </h1>

                    <div id={describedBy}>
                        <p tabIndex={-1} ref={focusFirstElement} className="bubp-checkout__ctp-modal-text">
                            {i18n.get('ctp.infoPopup.subtitle')}
                        </p>

                        <ul className="bubp-checkout__ctp-modal-text bubp-checkout__ctp-modal-benefits" type="disc">
                            <li>{i18n.get('ctp.infoPopup.benefit1')}</li>
                            <li>{i18n.get('ctp.infoPopup.benefit2')}</li>
                            <li>{i18n.get('ctp.infoPopup.benefit3')}</li>
                        </ul>

                        <CtPBrand classNameModifiers={['popup']} />
                    </div>

                    <Button onClick={onCloseModal} label={i18n.get('close')} />
                </Fragment>
            )}
        </Modal>
    );
};

export { CtPInfoModal };
