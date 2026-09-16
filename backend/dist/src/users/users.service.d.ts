import { PrismaService } from '../prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        dreamWork: string;
        avatarUrl: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        _count: {
            savedJobs: number;
            testHistory: number;
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        dreamWork: string;
        avatarUrl: string;
    }>;
    findAllUsers(search?: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        dreamWork: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        _count: {
            savedJobs: number;
            testHistory: number;
        };
    }[]>;
    toggleStatus(userId: string): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
    }>;
}
