import {OmitType} from '@nestjs/swagger';
import {AddUserDto, EditUserDto, ListUserDto} from './user.dto';

export class ListManagerDto extends OmitType(ListUserDto, ['host', 'devices']) {
}

export class AddManagerDto extends OmitType(AddUserDto, ['deviceLimit']) {

}

export class EditManagerDto extends OmitType(EditUserDto, ['deviceLimit']) {

}
