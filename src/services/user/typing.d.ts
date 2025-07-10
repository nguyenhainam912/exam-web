export declare module User {
  export interface ListChucVuCapUy {
    id: string;
    idCoSoDang: string;
    vaiTro: string;
    nhom: string;
  }

  export interface Profile {
    id: string;
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    name: string;
    userPartitions: any[]
    roles: [{
      id: string
    }]
    permissionFunction: {
      id: string;
      name: string
    }
    permissions: [{
      name: string;
      ket: string;
      id: string;
    }]
    rolePermissionModules: {}[]
    userInfos: {
      roles: [{
        id: string,
        name: string
      }]
      provinces: {
        id: string
      }[]
    }[]
    userPartners: {
      partner: {
        id: string;
      }
      type: string;
    }[]
  }

  export interface Result {
    _id: string;
    username: string;
    email: string;
    systemRole: string;
    idCoSoDangGoc: string;
    listChucVuCapUy: ListChucVuCapUy[];
    profile: Profile;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}

export interface UserStore {
  itemList: User.Profile[];
  setItemList: (itemList: User.Profile[]) => void
  record: User.Profile
  setRecord: (record: User.Profile) => void
}
