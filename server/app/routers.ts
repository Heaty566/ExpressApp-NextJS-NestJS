import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as i18n from 'i18n';
import * as morgan from 'morgan';

i18n.configure({
        locales: ['en', 'vi'],
        autoReload: true,
        directory: `${process.cwd()}/locales`,
        defaultLocale: 'en',
        cookie: 'lang',
});

export const router = (app: INestApplication) => {
        app.use(cookieParser());
        app.use(morgan('dev'));

        //initialized i18n
        app.use(i18n.init);
        app.use((req, res, next) => {
                if (req.cookies.lang) {
                        i18n.setLocale(req.cookies.lang);
                } else {
                        res.cookie('lang', 'en');
                }

                next();
        });
};
