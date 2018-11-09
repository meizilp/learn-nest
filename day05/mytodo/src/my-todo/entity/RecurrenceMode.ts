import { Column } from 'typeorm';

export enum RecurrenceStrategy {
    None = 0,       // 不重复
    Daily = 1,      // 按照日期重复
    Weekly = 2,     // 按照周重复
    Monthly = 3,    // 按照月重复
    Yearly = 4,     // 按照年重复
}

export enum RecurrenceNextAlogrium {
    FromComplete = 0,   // 从完成时间开始计算
    FromStart = 1,      // 从开始时间开始计算
    FromDue = 2,        // 从截止时间开始计算
}

export enum RecurrenceNewTaskAlogrium {
    CreateNew = 0,      // 创建新任务
    ReuseThisTask = 1,  // 复用旧任务
}

export class RecurrenceMode {
    // 重复策略
    @Column({ nullable: true, default: RecurrenceStrategy.None })
    strategy: RecurrenceStrategy;

    // 不同重复策略的附加数据
    @Column('simple-json')
    strategyData: any;

    // 如何计算下次发生的时间
    @Column({ nullable: true, default: RecurrenceNextAlogrium.FromComplete })
    nextAlogrium: RecurrenceNextAlogrium;

    // 是否创建新任务
    @Column({ nullable: true, default: RecurrenceNewTaskAlogrium.CreateNew })
    newTaskAlogrium: RecurrenceNewTaskAlogrium;

    // 如果是创建新任务，那么最开始的任务id，便于找到一系列重复任务
    @Column('bigint', { nullable: true })
    baseTaskId: number;

    // 重复多少次后停止重复
    @Column({ nullable: true })
    recurrenceCount: number;

    // 当前已经发生了的次数
    @Column({ nullable: true })
    occurrenceCount: number;
}
