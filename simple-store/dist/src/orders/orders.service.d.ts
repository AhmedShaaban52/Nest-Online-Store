import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createOrderDto: CreateOrderDto): Promise<{
        items: ({
            product: {
                name: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                id: number;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
    }>;
    findAll(userId: number): Promise<({
        items: ({
            product: {
                name: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                id: number;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        items: ({
            product: {
                name: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                id: number;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
    }>;
}
