import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { router } from '../app/routers';
import '../test/test-utils/userMock';

const logger = new Logger('SERVER');
async function bootstrap() {
        const app = await NestFactory.create(AppModule);

        router(app);
        const PORT = process.env.PORT || 4000;
        await app.listen(PORT, () => {
                logger.log(`Listening on port ${PORT}`);
        });
}
bootstrap();
