import { Repository, EntityRepository, IsNull } from 'typeorm';
import { MyTodo } from './MyTodo';

@EntityRepository(MyTodo)
export class MyTodoRepository extends Repository<MyTodo> {

    // 查找所有的根任务。父任务为null的被视为根任务。
    async findRoots() {
        return await this.find({ where: { isDeleted: false, parentId: IsNull() } });
    }

    // 查找所有的子任务。
    async findDescendants() {
    }

    // 查找所有的祖先任务。
    async findAncestors() {

    }
}