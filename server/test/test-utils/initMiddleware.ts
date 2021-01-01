import * as i18n from 'i18n';

export const getInitMiddleware = () => {
        i18n.configure({
                directory: `${process.cwd()}/locales`,
                autoReload: true,
                locales: ['en', 'vi'],
                defaultLocale: 'en',
                cookie: 'lang',
        });

        return [i18n.init];
};
