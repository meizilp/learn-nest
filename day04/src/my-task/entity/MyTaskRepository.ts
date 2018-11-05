import { Repository, EntityRepository } from 'typeorm';
import { MyTask } from './myTask';

@EntityRepository(MyTask)
export class MyTaskRepository extends Repository<MyTask> {
    sayHello() {
        return 'hello custom repository';
    }
}