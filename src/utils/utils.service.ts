import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    messageParser(message: string): string {
        return message;
    }
}
