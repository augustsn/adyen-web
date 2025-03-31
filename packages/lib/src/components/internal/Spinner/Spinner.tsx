import { h } from 'preact';
import './Spinner.scss';

interface SpinnerProps {
    /**
     * Whether the spinner should be rendered inline
     */
    inline?: boolean;

    /**
     * size of the spinner (small/medium/large)
     */
    size?: string;
}

/**
 * Default Loading Spinner
 * @param props -
 */
const Spinner = ({ inline = false, size = 'large' }: SpinnerProps) => (
    <div data-testid="spinner" className={`bubp-checkout__spinner__wrapper ${inline ? 'bubp-checkout__spinner__wrapper--inline' : ''}`}>
        <div className={`bubp-checkout__spinner bubp-checkout__spinner--${size}`} />
    </div>
);

export default Spinner;
