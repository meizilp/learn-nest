import { TaskA } from 'taska/entity/TaskA';

export class CreateTaskADto {
    readonly title: string;     // 标题
    readonly parent?: TaskA;   // 父任务。
    readonly sibling?: TaskA;   // 在指定任务前插入，不指定则在列表最后增加。
}