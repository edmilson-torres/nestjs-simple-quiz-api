import { Catch, HttpException, Logger } from '@nestjs/common';
import { hrtime } from 'process';

@Catch(HttpException)
export class HttpExceptionFilter {
    private logger = new Logger('HTTP');

    catch(exception, host): void {
        const startAt = hrtime();

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        let message = exception.response;

        const { method, originalUrl } = request;

        response.on('finish', () => {
            const diff = hrtime(startAt);
            const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

            this.logger.error(
                `\x1B[32m ${method} ${originalUrl} \x1B[37m${status} \x1B[31m${JSON.stringify(message)} \x1B[33m${responseTime.toFixed(2)}ms `
            );
        });

        if (typeof message === 'object') {
            message = message.error;
        }

        response.status(status).json({
            statusCode: status,
            error: message,
            method,
            path: originalUrl,
            timestamp: new Date().toISOString()
        });
    }
}
