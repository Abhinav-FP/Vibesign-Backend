import {IsNumber, IsOptional, IsString, MinLength, ValidateNested} from "class-validator";
import {ApiProperty} from "../../decorators";
import {OmitType} from "@nestjs/swagger";
import {EditUserDto} from "../../users/user.dto";

export class LatLng {

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lat: number;

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lng: number;
}

export class DeviceLocation {

    @MinLength(3)
    @IsOptional()
    @ApiProperty()
    address: string = '';

    @ValidateNested()
    @IsOptional()
    @ApiProperty({type: () => LatLng})
    location: LatLng = new LatLng();

}

export class UserLoginDto {

    @ApiProperty()
    @IsString()
    credential: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class UserProfileDto extends OmitType(EditUserDto, ['phone', 'deviceLimit', 'expiryDate', 'active']) {

}
