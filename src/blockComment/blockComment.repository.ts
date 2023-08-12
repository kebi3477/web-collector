import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { BlockComment } from "./blockComment.entity";
import { CreateBlockCommentDTO } from "./blockComment.dto";

@Injectable()
export class BlockCommentRepository {
    public constructor(
        @InjectRepository(BlockComment)
        private readonly repository: Repository<BlockComment>,
    ) {}

    public create(createBlockCommentDTO: CreateBlockCommentDTO): BlockComment {
        return this.repository.create(createBlockCommentDTO);
    }
    
    public async read(id: number): Promise<BlockComment> {
        return this.repository.findOne({ where: { id: id } });
    }

    public async update(id: number, content: string): Promise<UpdateResult> {
        return this.repository.update(id, { content: content });
    }

    public async delete(userId: string, blockId: string, id: number): Promise<void> {
        await this.repository.delete({ id : id, user: { id: userId }, block: { id: blockId } });
    }

    public async save(retrospective: BlockComment) {
        return await this.repository.save(retrospective);
    }

    public async getListByBlockId(blockId: string): Promise<BlockComment[]> {
        return this.repository.find({ where: { block: { id: blockId } } })
    }
}