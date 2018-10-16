import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

@Module({   //Module装饰符
    controllers: [AppController],   //引用指定的控制器
})
export class ApplicationModule { }