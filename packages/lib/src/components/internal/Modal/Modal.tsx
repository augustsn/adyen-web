import { ComponentChildren, h } from 'preact';
import { useRef } from 'preact/hooks';
import cx from 'classnames';
import './Modal.scss';
import { useModal } from './useModal';

type ModalRenderFnProps = {
    /**
     * Function used to properly trigger the Modal close mechanism. It takes into account the element that the Modal needs
     * to set focus when it is dismissed.
     */
    onCloseModal(): void;
};

type ModalProps = {
    children: ({ onCloseModal }: ModalRenderFnProps) => ComponentChildren;
    classNameModifiers?: string[];
    onClose(): void;
    isOpen: boolean;
    isDismissible?: boolean;
    labelledBy: string;
    describedBy: string;
    /**
     * Reference to the element that should be focused when the modal is opened
     */
    focusFirst: HTMLElement;
    /**
     * Reference to the element that should be focused when the modal is closed
     */
    focusAfterClose: HTMLElement;
};

const Modal = ({
    children,
    classNameModifiers = [],
    isOpen,
    onClose,
    isDismissible = true,
    labelledBy,
    describedBy,
    focusFirst,
    focusAfterClose,
    ...props
}: ModalProps) => {
    const modalContainerRef = useRef<HTMLDivElement>();
    const { closeModal, handleClickOutside } = useModal({
        modalElement: modalContainerRef.current,
        isOpen,
        isDismissible,
        focusFirst,
        focusAfterClose,
        onClose
    });

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <div
            className={cx(
                'bubp-checkout__modal-wrapper',
                classNameModifiers.map(m => `bubp-checkout__modal-wrapper--${m}`),
                { 'bubp-checkout__modal-wrapper--open': isOpen }
            )}
            role="dialog"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            aria-modal="true"
            aria-hidden={!isOpen}
            onClick={handleClickOutside}
            {...props}
        >
            <div className="bubp-checkout__modal" ref={modalContainerRef}>
                {children({ onCloseModal: closeModal })}
            </div>
        </div>
    );
};

export { Modal };
