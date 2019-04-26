
export interface IIntegrationNavet {
  id: number;
  type: string;
  title?: string;
  matterType: MatterType | string;
  exportedFields: string[];
  custodianFieldItem: string;
}

export enum MatterType {
  FTJ = 'ftj',
  RFTJ = 'rftj'
}
