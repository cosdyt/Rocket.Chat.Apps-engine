import * as FileType from 'file-type';

import { IUploadCreator } from '../../definition/accessors';
import { IUpload } from '../../definition/uploads';
import { IUploadDescriptor } from '../../definition/uploads/IUploadDescriptor';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';
import { AppBridges } from '../bridges';

export class UploadCreator implements IUploadCreator {
    constructor(
        private readonly bridges: AppBridges,
        private readonly appId: string,
    ) { }

    public async uploadBuffer(buffer: Buffer, descriptor: IUploadDescriptor): Promise<IUpload> {

        if (!descriptor.hasOwnProperty('user')) {
            descriptor.user = await this.bridges.getUserBridge().getAppUser(this.appId);
        }

        const detectedFileType = await FileType.fromBuffer(buffer);

        const details = {
            name: descriptor.filename,
            size: buffer.length,
            type: detectedFileType.mime,
            rid: descriptor.room.id,
            userId: descriptor.user && descriptor.user.id,
        } as IUploadDetails;

        return this.bridges.getUploadBridge().createUpload(details, buffer, this.appId);
    }
}
