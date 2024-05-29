export interface IRole {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  nb_users: number;
  permissions?: any;
}

export interface IRoutesInfo {
  name: string;
  base: string;
  method: string;
}

export interface IPermissions {
  id: number;
  attributes: {
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
