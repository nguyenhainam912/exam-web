export declare namespace Role {
  export interface Record {
    id: string;
    name: string;
    description: string;
    permissionModuleIds: string[];
  }
}

export interface RoleStore {
  itemList: Role.Record[];
  setItemList: (itemList: any[]) => void;
  record: Role.Record;
  setRecord: (record: any) => void;
}