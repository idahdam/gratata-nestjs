import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';

const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('PostsController', () => {
    let controller: PostsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                {
                    provide: PostsService,
                    useValue: mockPostsService,
                },
            ],
        }).compile();

        controller = module.get<PostsController>(PostsController);
    });

    afterAll(() => {});
    afterEach(() => {});

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a post', async () => {
            // Arrange
            const postDto = {
                title: 'Test Post',
                body: 'Test body',
            } as PostDto;
            const req = { user: { id: 1 } };

            // Act
            // Option 1: Using mockResolvedValue
            // mockPostsService.create.mockResolvedValue(postDto);

            // expect(await controller.create(postDto, req)).toBe(postDto);

            // Option 2: Using jest spyOn
            jest.spyOn(mockPostsService, 'create').mockReturnValue(postDto);

            const result = await controller.create(postDto, req);

            // Assert
            expect(mockPostsService.create).toHaveBeenCalledTimes(1);
            expect(mockPostsService.create).toHaveBeenCalledWith(
                postDto,
                req.user.id,
            );

            expect(result).toEqual(postDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            // Arrange
            const posts: PostDto[] = [
                { title: 'Post 1', body: 'body 1' },
                { title: 'Post 2', body: 'body 2' },
            ];

            // Act
            // Option 1: Using mockResolvedValue
            // mockPostsService.findAll.mockResolvedValue(posts);

            // expect(await controller.findAll()).toBe(posts);

            // Option 2: Using jest spyOn
            jest.spyOn(mockPostsService, 'findAll').mockResolvedValue(posts);

            const result = await controller.findAll();

            // Assert
            expect(mockPostsService.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(posts);
        });
    });

    describe('findOne', () => {
        it('should return a post', async () => {
            // Arrange
            const post = { title: 'Test Post', body: 'Test body' } as PostDto;

            // Act
            // Option 1: Using mockResolvedValue
            mockPostsService.findOne.mockResolvedValue(post);

            expect(await controller.findOne(1)).toBe(post);
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            // Arrange
            const postDto = {
                title: 'Test Post',
                body: 'Test body',
            } as PostDto;
            const req = { user: { id: 1 } };

            // Act
            // Option 1: Using mockResolvedValue
            mockPostsService.update.mockResolvedValue([1]);

            expect(await controller.update(1, postDto, req)).toStrictEqual({
                message: 'Successfully updated',
            });

            // Option 2: Using jest spyOn
            // jest.spyOn(mockPostsService, 'update').mockReturnValue(postDto);

            // const result = await controller.update(1, postDto, req);

            // // Assert
            // expect(mockPostsService.update).toHaveBeenCalledTimes(1);
            // expect(mockPostsService.update).toHaveBeenCalledWith(
            //     1,
            //     postDto,
            //     req.user.id,
            // );

            // expect(result).toEqual(postDto);
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {
            // Arrange
            const postId = 1;
            const req = { user: { id: 1 } };

            // Act
            // Option 1: Using mockResolvedValue
            mockPostsService.delete.mockResolvedValue(1);

            expect(await controller.remove(postId, req)).toStrictEqual({
                message: 'Successfully deleted',
            });

            // Option 2: Using jest spyOn
            // jest.spyOn(mockPostsService, 'remove').mockReturnValue(1);

            // const result = await controller.remove(1, req);

            // // Assert
            // expect(mockPostsService.remove).toHaveBeenCalledTimes(1);
            // expect(mockPostsService.remove).toHaveBeenCalledWith(1, req.user.id);

            // expect(result).toEqual(1);
        });
    });
});
