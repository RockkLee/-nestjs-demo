import { User } from '@nestjs-demo/domain/entity/user';

export interface UserRepo {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    deleteById(id: string): Promise<void>;
    update(user: User): Promise<void>;
}
