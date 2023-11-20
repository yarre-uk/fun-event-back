import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('hello-world')
  test() {
    return 'Hello world!';
  }

  @Get('test')
  test1() {
    return 'test!';
  }
}
