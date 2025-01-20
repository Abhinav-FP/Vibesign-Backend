import {OmitType} from '@nestjs/swagger';
import {AddUserDto, EditUserDto, ListUserDto} from './user.dto';

export class ListPartnerDto extends OmitType(ListUserDto, ['host', 'phone', 'devices']) {
}

export class AddPartnerDto extends OmitType(AddUserDto, ['phone', 'deviceLimit']) {

}

export class EditPartnerDto extends OmitType(EditUserDto, ['phone', 'deviceLimit']) {

}
