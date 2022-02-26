import { Injectable } from '@nestjs/common';

// use this for mutational functions

@Injectable()
export class UtilsService {
    messageParser(message: string): string {
        return message;
    }
}
