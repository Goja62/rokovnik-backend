import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ok')
  getHello(): string {
    return "Zdravo";
  }
}
