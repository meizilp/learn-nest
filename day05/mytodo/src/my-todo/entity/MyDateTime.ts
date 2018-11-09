import { Column } from 'typeorm';

export class MyDateTime {
    // 日期时间的值
    @Column({ nullable: true })
    value: Date;

    // 时间域是否有效
    @Column({ nullable: true })
    hasTime: boolean;
}