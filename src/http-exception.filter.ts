import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: Logger) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        const status = exception.getStatus()

        const message = exception.message

        const { method, originalUrl } = request

        response.on('finish', () => {
            this.logger.error(
                `\x1B[32m ${method} ${originalUrl} \x1B[37m${status} \x1B[31m${message}`
            )
        })

        response.status(status).json({
            statusCode: status,
            error: message,
            method,
            path: originalUrl,
            timestamp: new Date().toISOString()
        })
    }
}
