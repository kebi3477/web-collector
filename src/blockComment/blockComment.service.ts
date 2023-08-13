import { Injectable } from '@nestjs/common';
import { BlockCommentRepository } from './blockComment.repository';
import { Logger } from '../module/logger';
import { CreateBlockCommentDTO, UpdateBlockCommentDTO } from './blockComment.dto';
import { UserRepository } from '../user/user.repository';
import { BlockRepository } from '../block/block.repository';
import { BlockComment } from './blockComment.entity';
import { User } from '../user/user.entity';
import { UserMessage } from '../user/user.message';
import { Block } from '../block/block.entity';
import { BlockMessage } from '../block/block.message';
import { BlockCommentMessage } from './blockComment.message';

@Injectable()
export class BlockCommentService {
    private logger = new Logger(BlockCommentService.name).getLogger();

    constructor(
        private readonly model: BlockCommentRepository,
        private readonly userModel: UserRepository,
        private readonly blockModel: BlockRepository,
    ) {}

    /**
     * 댓글 생성
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @param createBlockCommentDTO 댓글 생성 DTO
     * @returns 생성한 댓글
     */
    public async create(userId: string, blockId: string, createBlockCommentDTO: CreateBlockCommentDTO): Promise<BlockComment> {
        try {
            this.logger.log(`[댓글 생성] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[댓글 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[댓글 생성] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            createBlockCommentDTO.user = user;
            createBlockCommentDTO.block = block;
        
            const comment: BlockComment = this.model.create(createBlockCommentDTO);
            comment.user.password = null;
            this.logger.log(`[댓글 생성] 성공 [ id : ${comment.id} ] `);
            return await this.model.save(comment);
        } catch (error) {
            this.logger.error(`[댓글 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 댓글 수정
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @param commentId 댓글ID
     * @param updateBlockCommentDTO 댓글 수정 DTO
     * @returns 수정한 댓글 정보
     */
    public async update(userId: string, blockId: string, commentId: number, updateBlockCommentDTO: UpdateBlockCommentDTO): Promise<BlockComment> {
        try {
            this.logger.log(`[댓글 수정] API 호출 [ commentId : ${commentId}, userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[댓글 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[댓글 수정] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            const comment: BlockComment = await this.model.read(commentId);
            if (!comment) {
                this.logger.log(`[댓글 수정] 실패 [ blockId : ${blockId}] -> 댓글을 찾을 수 없음`);
                throw new Error(BlockCommentMessage.NOT_FOUND);
            } 
            
            Object.assign(comment, updateBlockCommentDTO);
            this.logger.log(`[댓글 수정] 성공 [ id : ${comment.id} ] `);
            
            return await this.model.save(comment);
        } catch (error) {
            this.logger.error(`[댓글 수정] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 댓글 삭제
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @param commentId 댓글ID
     * @returns 삭제한 댓글 정보
     */
    public async delete(userId: string, blockId: string, commentId: number): Promise<BlockComment> {
        try {
            this.logger.log(`[댓글 삭제] API 호출 [ commentId : ${commentId}, userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[댓글 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[댓글 삭제] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            const comment: BlockComment = await this.model.read(commentId);
            if (!comment) {
                this.logger.log(`[댓글 삭제] 실패 [ blockId : ${blockId}] -> 댓글을 찾을 수 없음`);
                throw new Error(BlockCommentMessage.NOT_FOUND);
            } 
            
            await this.model.delete(userId, blockId, commentId);
            this.logger.log(`[댓글 삭제] 성공 [ id : ${commentId} ] `);
            
            return comment;
        } catch (error) {
            this.logger.error(`[댓글 삭제] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 댓글 목록 조회
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @returns 블록ID로 조회한 댓글 목록
     */
    public async getList(userId: string, blockId: string): Promise<BlockComment[]> {
        try {
            this.logger.log(`[댓글 목록 조회] API 호출 [ blockId : ${blockId}, userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[댓글 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[댓글 목록 조회] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }
            
            const comments: BlockComment[] = await this.model.getListByBlockId(blockId);
            this.logger.log(`[댓글 목록 조회] 성공 [ blockId : ${blockId} ] `);
            
            return comments;
        } catch (error) {
            this.logger.error(`[댓글 목록 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }
}
