import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(req: any, id: number): Promise<{
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
