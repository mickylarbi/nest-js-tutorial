import { ConsoleLogger, Injectable } from '@nestjs/common';
import fs from 'fs'
import path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
    async logToFile(entry: string) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US',
            {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Chicago'
            }
        ).format(new Date())}\t${entry}`

        try {
            const filePath = path.join(__dirname, '..', '..', 'logs')

            if (!fs.existsSync(filePath))
                await fs.promises.mkdir(filePath)

            await fs.promises.appendFile(path.join(filePath, 'myLogFile.log'), formattedEntry)

        } catch (e) {
            if (e instanceof Error) console.error(e.message)
        }

    }


    log(message: any, context?: string): void {
        const entry = `${context}\t${message}`
        this.logToFile(entry)
        super.log(message, context)
    }

    error(message: any, stackOrContext?: string): void {
        const entry = `${stackOrContext}\t${message}`
        this.logToFile(entry )
        super.error(message, stackOrContext)
    }



}
