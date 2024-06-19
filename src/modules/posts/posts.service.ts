import { Injectable, Inject } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { User } from '../users/entity/user.entity';
import { PostDto } from './dto/post.dto';
import { POST_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
    ) {}

    async create(post: PostDto, userId): Promise<Post> {
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async findOne(id: number): Promise<Post> {
        return await this.postRepository.findOne({
            where: { id },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async delete(id: number, userId: number) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id: number, data: PostDto, userId: number) {
        const result = await this.postRepository.update(
            { ...data },
            { where: { id, userId } },
        );

        return result;
    }
}
