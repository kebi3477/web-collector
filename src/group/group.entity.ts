import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Block } from '../block/block.entity';

export enum GroupType {
    Private = 0,
    FollowersOnly = 1,
    Public = 2,
}

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid', {
        comment: '그룹 고유 아이디',
    })
    id: string;
  
    @ManyToOne(() => User, (user) => user.groups, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id'
    })
    user: User;
  
    @Column({ 
        length: 100,
        comment: '그룹 제목',
     })
    title: string;

    @Column({
        type: 'enum',
        enum: GroupType,
        default: GroupType.Private,
        comment: '공개 범위 (0: 비공개, 1: 팔로워만, 2: 전체 공개)',
    })
    type: GroupType
  
    @CreateDateColumn({ 
        name: 'created_at', 
        type: 'timestamp', 
        nullable: true, 
        comment: '생성날짜' 
    })
    createdAt: Date;
  
    @UpdateDateColumn({ 
        name: 'updated_at', 
        type: 'timestamp', 
        nullable: true, 
        comment: '수정날짜' 
    })
    updatedAt: Date | null;

    @OneToMany(() => Block, (block) => block.group)
    blocks: Block[];
}
  