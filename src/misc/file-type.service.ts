import {Buffer} from 'buffer';
import {Injectable} from '@nestjs/common';
import {IUploadedFile, IAssetTypeDetector, IFileType, fileTypeFromBuffer} from '@stemy/nest-utils';

@Injectable()
export class AssetFileTypeService implements IAssetTypeDetector {
    async detect(file: IUploadedFile): Promise<IFileType> {
        const fileType = {
            ext: file.originalname.split('.').pop(),
            mime: file.mimetype,
        } as IFileType;
        const [tag, type] = file.mimetype.split('/');
        const magic = Array.from(file.buffer.slice(0, 8)).map(t => '0x' + t.toString(16)).join(', ');
        console.log(`{
    tag: '${tag}',
    type: '${type}',
    ext: '${fileType.ext}',
    mime: '${fileType.mime}',
    magic: [${magic}],
    pattern: null,
}`);
        return fileType;
    }
}
