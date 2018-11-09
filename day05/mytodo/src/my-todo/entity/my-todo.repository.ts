import { Repository, EntityRepository } from 'typeorm';
import { MyTodo } from './MyTodo';

@EntityRepository(MyTodo)
export class MyTodoRepository extends Repository<MyTodo> {
}