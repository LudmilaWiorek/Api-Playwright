export interface UserDataModel {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar?: string
}

export interface UserSupportModel {
  url: string
  text: string
}

export interface UserModel {
  data: UserDataModel
  support: UserSupportModel
}

export interface UserListModel {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: UserDataModel[]
}

export interface ResourceDataModel {
  id: number
  name: string
  year: number
  color: string
  pantone_value: string
}

export interface ResourceListModel {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: ResourceDataModel[]
}

export interface ResourcesDataAndListModels {
  data: ResourceDataModel
  list: ResourceListModel
}

export interface CreateUserModel {
  name: string
  job: string
  id?: string
  createdAt?: string
  updatedAt?: string
}

//
export interface RegisterUserModel {
  email: string
  password?: string
  id?: number
  token?: string
  error?: string
}
