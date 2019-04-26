import { AppContentSize } from './../models/Enums';
import { IFormStatus } from '@/models/IForm';
import { FormStatus } from '@/models/Enums';
export class Helper {
  /**
   * Convert component name to kebab-case, for ex. FieldTextBox is converted to field-text-box.
   * @param name {string} String to convert from
   */
  public static getComponentName(name: string): string {
    return name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Makes a deep-copy of object to remove reference to state,
   * objects inside objekt will be a copy of the original-objekt.
   * @param data object to make copy of.
   */
  public static deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Makes a shallow-copy of object to remove reference to state,
   * objects inside object will be a reference to the original-objekt.
   * @param data object to make copy of.
   */
  public static shallowCopy<T>(data: T): T {
    return Object.assign({}, data);
  }

  /**
   * Generate new id as string and a value less than 0;
   */
  public static generateTempId(): string {
    return Math.floor(Math.random() * (100000) * - 1).toString();
  }

  /**
   * Generate new id as integer and a value less than 0;
   */
  public static generateTempIdInteger(): number {
    return Math.floor(Math.random() * (100000) * - 1);
  }

  /**
   * Generate new guid as string;
   */
  public static generateUuid(): string {
    const hex = [] as any;
    for (let i = 0; i < 256; i++) {
      hex[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    let r = new Uint8Array(16);
    if (window.crypto !== undefined) {
      r = crypto.getRandomValues(new Uint8Array(16));
    } else {
      r = (window as any).msCrypto.getRandomValues(new Uint8Array(16));
    }

    /* tslint:disable-next-line */
    r[6] = r[6] & 0x0f | 0x40;
    /* tslint:disable-next-line */
    r[8] = r[8] & 0x3f | 0x80;

    return (
        hex[r[0]] +
        hex[r[1]] +
        hex[r[2]] +
        hex[r[3]] +
        '-' +
        hex[r[4]] +
        hex[r[5]] +
        '-' +
        hex[r[6]] +
        hex[r[7]] +
        '-' +
        hex[r[8]] +
        hex[r[9]] +
        '-' +
        hex[r[10]] +
        hex[r[11]] +
        hex[r[12]] +
        hex[r[13]] +
        hex[r[14]] +
        hex[r[15]]
    );
  }

  /**
   * Get status for form with info about text and colors
   */
  public static getStatus(status): IFormStatus {

    let result: IFormStatus;

    return status === FormStatus.Published
      ? result = { statusColorBg: 'success', statusColorText: 'black'}
      : status === FormStatus.Draft
        ? result = { statusColorBg: 'warning', statusColorText: 'black'}
        : status === FormStatus.Unpublished
          ? result = { statusColorBg: 'error', statusColorText: 'black'}
          : result = {};
  }

  /** Get appropriate classes determining grid size, depending on given AppContentSize */
  public static getSizeClasses(size: AppContentSize): string {
    if (size === AppContentSize.Default) {
      return 'xs12 sm10 md9 lg7';
    } else {
      // wide
      return 'xs12 md11 lg10 xl9';
    }
  }

  /** Sort by title in ascending order */
  public static sortByTitle(a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  }
}
