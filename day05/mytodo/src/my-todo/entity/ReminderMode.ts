import { Column } from 'typeorm';

export enum ReminderStrategy {
    None = 0,       // 无提醒
    Relative = 1,   // 相对于todo的开始或者截止时间
    Absolute = 2,   // 指定的绝对时间
}

export enum ReminderMethod {
    PopWindow = 0,  // 弹窗
    Email = 1,      // 邮件
    Phone = 2,      // 电话
    SMS = 3,        // 短信
    APP = 4,        // 手机APP
}

export class ReminderMode {
    // 提醒策略
    @Column({ nullable: true, default: ReminderStrategy.None })
    strategy: ReminderStrategy;

    // 提醒时的声音
    @Column({ nullable: true })
    sound: string;

    // 提醒时的方法
    @Column('simple-array', { nullable: true })
    method: ReminderMethod[];

    // 策略为绝对时间时，指定的值
    @Column({ nullable: true })
    absoluteTime: Date;

    // 策略为相对时间时，是否是相对于开始
    @Column({ nullable: true })
    relativeStart: boolean;

    // 策略为相对时间时，相对开始时间偏移的值
    @Column({ nullable: true })
    relativeStartMinutes: number;

    // 策略为相对时间时，是否是相对于截止
    @Column({ nullable: true })
    relativeDue: boolean;

    // 策略为相对时间时，相对截止时间偏移的值
    @Column({ nullable: true })
    relativeDueMinutes: number;
}