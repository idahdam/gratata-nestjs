import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { POST_REPOSITORY } from '../../core/constants';
import { Post } from './entity/post.entity';
import { User } from '../users/entity/user.entity';
import { PostDto } from './dto/post.dto';

const mockPostRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
};

describe('PostsService', () => {
    let service: PostsService;
    let createdPost: Post;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: POST_REPOSITORY,
                    useValue: mockPostRepository,
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);

        // Create a test post
        const postDto: PostDto = {
            title: 'Initial Post',
            body: 'Initial body',
        };
        const userId = 1;
        createdPost = { ...postDto, userId, id: 1 } as Post;

        mockPostRepository.create.mockResolvedValue(createdPost);
        await service.create(postDto, userId);
    });

    afterAll(async () => {
        // Clean up the test post
        const id = 1;
        const userId = 1;

        mockPostRepository.destroy.mockResolvedValue(1);
        await service.delete(id, userId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a post', async () => {
            const postDto: PostDto = {
                title: 'Test Post',
                body: 'Test body',
            };
            const userId = 1;
            const createdPost = { ...postDto, userId, id: 2 } as Post;

            // Option 1: Using mockResolvedValue
            // mockPostRepository.create.mockResolvedValue(createdPost);

            // expect(await service.create(postDto, userId)).toEqual(createdPost);
            // expect(mockPostRepository.create).toHaveBeenCalledWith({
            //     ...postDto,
            //     userId,
            // });

            // Option 2: Using jest spyOn
            jest.spyOn(mockPostRepository, 'create').mockResolvedValue(
                createdPost,
            );

            const result = await service.create(postDto, userId);

            // Assert
            expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
            expect(mockPostRepository.create).toHaveBeenCalledWith({
                ...postDto,
                userId,
            });
            expect(result).toEqual(createdPost);
        });

        it('should throw an error if the post could not be created', async () => {
            const postDto: PostDto = {
                title: 'Test Post',
                body: 'Test body',
            };
            const userId = 1;

            // Option 1: Using mockRejectedValue
            // mockPostRepository.create.mockRejectedValue(new Error());

            // await expect(service.create(postDto, userId)).rejects.toThrow();
            // expect(mockPostRepository.create).toHaveBeenCalledWith({
            //     ...postDto,
            //     userId,
            // });

            // Option 2: Using jest spyOn
            jest.spyOn(mockPostRepository, 'create').mockRejectedValue(
                new Error(),
            );
            // Assert
            await expect(service.create(postDto, userId)).rejects.toThrow();
            expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
            expect(mockPostRepository.create).toHaveBeenCalledWith({
                ...postDto,
                userId,
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            // Arrange
            const posts: Post[] = [
                createdPost,
                {
                    id: 2,
                    title: 'Post 2',
                    body: 'body 2',
                    userId: 1,
                } as Post,
            ];

            // Act
            // Option 1: Using mockResolvedValue
            // mockPostRepository.findAll.mockResolvedValue(posts);

            // expect(await service.findAll()).toEqual(posts);
            // expect(mockPostRepository.findAll).toHaveBeenCalled();

            // Option 2: Using jest spyOn
            jest.spyOn(mockPostRepository, 'findAll').mockResolvedValue(posts);

            const result = await service.findAll();

            // Assert
            expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(posts);
        });

        it('should return empty array of posts', async () => {
            // Arrange
            const posts: Post[] = [];

            // Act
            // Option 1: Using mockResolvedValue
            mockPostRepository.findAll.mockResolvedValue(posts);

            expect(await service.findAll()).toEqual(posts);
            expect(mockPostRepository.findAll).toHaveBeenCalled();

            // // Option 2: Using jest spyOn
            // jest.spyOn(mockPostRepository, 'findAll').mockResolvedValue(posts);

            // const result = await service.findAll();

            // // Assert
            // expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
            // expect(result).toEqual(posts);
        });
    });

    describe('findOne', () => {
        it('should return a single post', async () => {
            mockPostRepository.findOne.mockResolvedValue(createdPost);

            expect(await service.findOne(1)).toEqual(createdPost);
            expect(mockPostRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                include: [
                    { model: User, attributes: { exclude: ['password'] } },
                ],
            });
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {
            const id = 2;
            const userId = 1;

            mockPostRepository.destroy.mockResolvedValue(1);

            expect(await service.delete(id, userId)).toEqual(1);
            expect(mockPostRepository.destroy).toHaveBeenCalledWith({
                where: { id, userId },
            });
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const id = 1;
            const userId = 1;
            const postDto: PostDto = {
                title: 'Updated Post',
                body: 'Updated body',
            };

            mockPostRepository.update.mockResolvedValue([1]);

            expect(await service.update(id, postDto, userId)).toEqual([1]);
            expect(mockPostRepository.update).toHaveBeenCalledWith(
                { ...postDto },
                { where: { id, userId } },
            );
        });
    });
});
