import BubpCheckoutError from '../Errors/BubpCheckoutError';

export interface ImageOptions {
    extension?: string;
    imageFolder?: string;
    resourceContext?: string;
    name?: string;
    parentFolder?: string;
    size?: string;
    subFolder?: string;
    svgOptions?: string;
    type?: string;
}

export type GetImageFnType = (name) => string;

export class Resources {
    private readonly resourceContext: string;

    constructor(cdnContext: string) {
        if (!cdnContext) {
            throw new BubpCheckoutError('IMPLEMENTATION_ERROR', 'Resources module: "environmentsUrls.cdn" is not a valid URL');
        }
        this.resourceContext = cdnContext;
    }

    private returnImage = ({
        name,
        resourceContext,
        imageFolder = '',
        parentFolder = '',
        extension,
        size = '',
        subFolder = ''
    }: ImageOptions): string => `${resourceContext}images/${imageFolder}${subFolder}${parentFolder}${name}${size}.${extension}`;

    private getImageUrl =
        ({ resourceContext, extension = 'svg', ...options }: ImageOptions): GetImageFnType =>
        (name: string): string => {
            const imageOptions: ImageOptions = {
                extension,
                resourceContext,
                imageFolder: 'logos/',
                parentFolder: '',
                name,
                ...options
            };

            return this.returnImage(imageOptions);
        };

    public getImage(props = {} as ImageOptions) {
        return this.getImageUrl({ ...props, resourceContext: this.resourceContext });
    }
}
