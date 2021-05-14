import { uuid } from '../../core/types';

export type Blob = {
  type: string;
  /**
   * Buffer/ByteArray stream
   */
  data: ArrayBuffer;
};

export class Image {
  id: uuid;
  name: string;
  contentType: string;
  size: number;
  base64: string;
  base64Url: string;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  constructor(data = {} as Partial<Image & { base64: string }>) {
    this.id = data.id;
    this.name = data.name;
    this.contentType = data.contentType;
    this.size = data.size;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
    this.base64Url =
      data.base64Url ||
      (data.base64
        ? `url(data:${data.contentType || 'image/png'};base64,${data.base64})`
        : undefined);
  }
}
