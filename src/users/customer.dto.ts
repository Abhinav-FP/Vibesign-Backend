import {OmitType} from '@nestjs/swagger';
import {AddUserDto, EditUserDto, ListUserDto} from './user.dto';

export class ListCustomerDto extends OmitType(ListUserDto, ['phone']) {
}

export class AddCustomerDto extends OmitType(AddUserDto, ['phone']) {

}

export class EditCustomerDto extends OmitType(EditUserDto, ['phone']) {

}
