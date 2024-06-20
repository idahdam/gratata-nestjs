import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';

const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
});
