import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum MyTodoType {
    Todo = 0, Project = 1, Folder = 2, Goal = 3,
}

export enum MyTodoImportance {
    NotImportant = 0, Normal = 5, VeryImportant = 10,
}

export enum MyTodoPriority {
    NotUrgency = 0, Normal = 5, First = 10,
}

export enum MyTodoStatus {
    New = 0, Running = 1, Completed = 2, NotStart = 3, Abandoned = 4, Paused = 5,
}

@Entity()
export class MyTodo {
    // 唯一ID。目前方案采用当前时间(毫秒)来作为id。
    @PrimaryColumn('bigint')
    id: number;

    // 标题。
    @Column({ nullable: true })
    title: string;

    // 备注的id。支持多次备注，顺序存储。
    @Column('simple-array', { nullable: true })
    noteIds: number[];

    // 标签。支持多个标签。
    @Column('simple-array', { nullable: true })
    tagIds: number[];

    // 类型。默认为待办。
    @Column({ default: MyTodoType.Todo })
    type: number;

    // 是否加密。
    @Column({ default: false })
    isEncrypt: boolean;

    // 是否标记。
    @Column({ default: false })
    isFlag: boolean;

    // 创建者ID。
    @Column('bigint', { nullable: true })
    creatorId: number;

    // 创建日期和时间。
    @Column()
    createDateTime: Date;

    dueDate;
    dueTime;

    completeDate;
    completeTime;

    startDate;
    startTime;

    // 任务来源。
    @Column('bigint', { nullable: true })
    allocatedSourceId: number;

    // 任务执行人
    @Column('simple-array', { nullable: true })
    executorIds: number[];

    // 父任务id。
    @Column('bigint', { nullable: true })
    parentId: number;

    // 子任务ids。
    @Column('simple-array', { nullable: true })
    childIds: number[];

    risk;

    // 重要度
    @Column({ default: MyTodoImportance.Normal })
    importance: MyTodoImportance;

    // 优先级
    @Column({ default: MyTodoPriority.Normal })
    priority: MyTodoPriority;

    // 预估时间（分钟）
    @Column({ nullable: true })
    estimationTime: number;

    // 剩余时间（分钟）
    @Column({ nullable: true })
    remainingTime: number;

    // 已经耗费时间（分钟）
    @Column({ nullable: true })
    spentTime: number;

    // 时间追踪记录ids。
    @Column('simple-array', { nullable: true })
    timetrackIds: number[];

    // 修改记录ids。
    @Column('simple-array', { nullable: true })
    modificationIds: number[];

    reminderMode;

    // 完成百分比
    @Column({ nullable: true })
    completePercent: number;

    // 状态
    @Column({ nullable: true, default: MyTodoStatus.New })
    status: MyTodoStatus;

    // 是否已经删除
    @Column({ default: false })
    isDeleted: boolean;

    // 附件Ids
    @Column('simple-array', { nullable: true })
    attachmentIds: number[];

    recurrenceMode;

    nextReviewDate;
    nextReviewTime;

    // 依赖ids
    @Column('simple-array', { nullable: true })
    dependencyIds: number[];
}
