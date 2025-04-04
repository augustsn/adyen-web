import { Component, h } from 'preact';
import classNames from 'classnames';
import './Iframe.scss';

interface IframeProps {
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    border?: string;
    src?: string;
    allow?: string;
    name?: string;
    title?: string;
    classNameModifiers?: string[];
    callback?: (contentWindow) => void;
}

class Iframe extends Component<IframeProps> {
    public static defaultProps = {
        width: '0',
        height: '0',
        minWidth: '0',
        minHeight: '0',
        src: null,
        allow: null,
        title: 'components iframe',
        classNameModifiers: []
    };

    private iframeEl;

    iframeOnLoad() {
        if (this.props.callback && typeof this.props.callback === 'function') {
            this.props.callback(this.iframeEl.contentWindow);
        }
    }

    componentDidMount() {
        if (this.iframeEl.addEventListener) {
            this.iframeEl.addEventListener('load', this.iframeOnLoad.bind(this), false);
        } else if (this.iframeEl.attachEvent) {
            // IE fallback
            this.iframeEl.attachEvent('onload', this.iframeOnLoad.bind(this));
        } else {
            this.iframeEl.onload = this.iframeOnLoad.bind(this);
        }
    }

    componentWillUnmount() {
        if (this.iframeEl.removeEventListener) {
            this.iframeEl.removeEventListener('load', this.iframeOnLoad.bind(this), false);
        } else if (this.iframeEl.detachEvent) {
            // IE fallback
            this.iframeEl.detachEvent('onload', this.iframeOnLoad.bind(this));
        } else {
            this.iframeEl.onload = null;
        }
    }

    render({ name, src, width, height, minWidth, minHeight, allow, title, classNameModifiers }: IframeProps) {
        const validClassNameModifiers = classNameModifiers.filter(m => !!m);

        return (
            <iframe
                ref={ref => {
                    this.iframeEl = ref;
                }}
                allow={allow}
                className={classNames(
                    'bubp-checkout__iframe',
                    `bubp-checkout__iframe--${name}`,
                    validClassNameModifiers.length && classNameModifiers.map(m => `bubp-checkout__iframe--${name}-${m}`)
                )}
                name={name}
                src={src}
                width={width}
                height={height}
                frameBorder="0"
                title={title}
                /* eslint-disable react/no-unknown-property */
                referrerpolicy="origin"
                min-width={minWidth}
                min-height={minHeight}
                /* eslint-enable react/no-unknown-property */
            />
        );
    }
}

export default Iframe;
