import { httpGet } from './http';
import type { Translations } from '../../language/types';

export default async function getTranslations(cdnTranslationsUrl: string, bubpWebVersion: string, locale: string): Promise<Translations> {
    try {
        return await httpGet({
            loadingContext: cdnTranslationsUrl,
            errorLevel: 'fatal',
            errorMessage: `Translations: Failed to fetch translations for locale "${locale}"`,
            path: `sdk/${bubpWebVersion}/translations/${locale}.json`
        });
    } catch (error) {
        return await httpGet({
            loadingContext: cdnTranslationsUrl,
            errorLevel: 'fatal',
            errorMessage: `Translations: Couldn't fetch translation for locale "${locale}" nor the fallback translation "en-US"`,
            path: `sdk/${bubpWebVersion}/translations/en-US.json`
        });
    }
}
