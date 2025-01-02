import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    validate,
} from 'class-validator';
import { DamageType } from '../models/damageType';
import { Response } from 'express';

export class BaseRequestBody {
    @IsString()
    @IsNotEmpty()
    playerName!: string;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    amount!: number;
}

export class DamageRequestBody extends BaseRequestBody {
    @IsString()
    @IsEnum(DamageType)
    @IsNotEmpty()
    damageType!: DamageType;
}

export const validateRequest = async (res: Response, info: BaseRequestBody) => {
    const errors = await validate(info);
    if (errors.length > 0) {
        console.error('validation failed. errors: ', errors);
        res.status(400).json({
            message: 'Invalid request body.',
            Errors: errors,
        });
        return false;
    }
    return true;
};
