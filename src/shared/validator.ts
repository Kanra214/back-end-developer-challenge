import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    validate,
} from 'class-validator';
import { DamageType } from '../models/damageType';

export class HpModifyInfo {
    @IsString()
    @IsNotEmpty()
    playerName!: string;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    amount!: number;
}

export class DamageInfo extends HpModifyInfo {
    @IsString()
    @IsEnum(DamageType)
    @IsNotEmpty()
    damageType!: DamageType;
}

export const validateRequest = async (info: HpModifyInfo) => {
    const errors = await validate(info);
    if (errors.length > 0) {
        console.error('validation failed. errors: ', errors);
        return errors;
    }
};
