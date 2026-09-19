import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        id: number;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        id: number;
    }>;
}
