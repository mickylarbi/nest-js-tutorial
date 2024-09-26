import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"
import { MyLoggerService } from "./my-logger/my-logger.service"
import { Request, Response } from "express"
import { PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library"

type MyResponseObject = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new MyLoggerService(AllExceptionsFilter.name)

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>
        const request = ctx.getRequest<Request>

        const myResponseObj: MyResponseObject = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request().url,
            response: '',
        }

        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus()
            myResponseObj.response = exception.getResponse()

        } else if (exception instanceof PrismaClientValidationError) {
            myResponseObj.statusCode = 422
            myResponseObj.response = exception.message.replaceAll(/\n/g, '')

        } else if (exception instanceof PrismaClientUnknownRequestError) {
            myResponseObj.statusCode = 422
            myResponseObj.response = exception.message.replaceAll(/\n/g, '')

        } else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            myResponseObj.response = 'Internal Server Error'
        }

        response().status(myResponseObj.statusCode).json(myResponseObj)

        this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

        super.catch(exception, host)

    }
}