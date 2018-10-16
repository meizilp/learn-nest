import { Get, Controller } from "@nestjs/common";

@Controller()   //控制器装饰器，标识下面的类是一个Controller。默认响应根路径。
export class AppController {
    @Get()  //Get请求装饰器。默认响应跟路径的Get请求
    root(): string {
        return 'Hello nest!'    //返回响应值
    }
}