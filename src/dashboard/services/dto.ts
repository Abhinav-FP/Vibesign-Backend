import {IsNumber, IsOptional, MinLength, ValidateNested} from "class-validator";
import {ApiProperty} from "../../decorators";

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
