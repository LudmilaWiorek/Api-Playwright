import { APIRequestContext, APIResponse } from '@playwright/test'
import {
  UserListModel,
  ResourceListModel,
  ResourcesDataAndListModels,
  CreateUserModel,
  RegisterUserModel,
  UserModel,
  ErrorResponseModel
} from '../interface/APIinterface.model'

export class ApiPage {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://reqres.in/api'

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async getUserById(id: number, expectedStatus: number): Promise<UserModel | ErrorResponseModel> {
    const response = await this.request.get(`${this.baseUrl}/users/${id}`)

    if (response.status() != expectedStatus)
      throw `Response status is not ${expectedStatus}`
    const responseJSON = JSON.parse(await response.text())
    if (response.status() >= 400) return responseJSON as ErrorResponseModel
    return responseJSON as UserModel
  }

  async getFailedEndpoint(): Promise<APIResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/users/wrongendpoint`,
    )
    return response
  }

  async getUserList(page: number): Promise<UserListModel> {
    const response = await this.request.get(
      `${this.baseUrl}/users?page=${page}`,
    )
    if (response.status() != 200) throw 'Response status not 200'
    const responseJSON = JSON.parse(await response.text())
    return responseJSON as UserListModel
  }

  async getListResource(): Promise<ResourceListModel> {
    const response = await this.request.get(`${this.baseUrl}/unknown`)
    if (response.status() != 200) throw 'Response status not 200'
    const responseJSON = JSON.parse(await response.text())
    return responseJSON as ResourceListModel
  }

  async getResourceById(
    id: number,
    expectedStatus: number,
  ): Promise<ResourcesDataAndListModels> {
    const response = await this.request.get(`${this.baseUrl}/unknown/${id}`)
    const responseJSON = JSON.parse(await response.text())
    if (response.status() != expectedStatus)
      throw `Response status is not ${expectedStatus}`
    return responseJSON as ResourcesDataAndListModels
  }

  async getDelayedResponse(delay: number): Promise<UserListModel> {
    const response = await this.request.get(
      `${this.baseUrl}/users?delay=${delay}`,
    )
    if (response.status() != 200) throw 'Response status not 200'
    const responseJSON = JSON.parse(await response.text())
    return responseJSON as UserListModel
  }

  //new methods for post and below for login
  // should it have the same interface in parameter and in promise?
  async createUser(newUser: CreateUserModel): Promise<CreateUserModel> {
    const response = await this.request.post(`${this.baseUrl}/users`, {
      data: newUser,
    })
    if (response.status() != 201) throw 'Response status not 201'
    const responseJSON = JSON.parse(await response.text())

    return responseJSON as CreateUserModel
  }

  async registerNewUser(
    newUser: RegisterUserModel,
    expectedStatus: number,
  ): Promise<RegisterUserModel | ErrorResponseModel> {
    const response = await this.request.post(`${this.baseUrl}/register`, {
      data: newUser,
    })

    if (response.status() != expectedStatus)
      throw `Response status not ${expectedStatus}`
    const responseJSON = JSON.parse(await response.text())
    if (response.status() >= 400) return responseJSON as ErrorResponseModel
    return responseJSON as RegisterUserModel
  }

  async loginUser(
    user: RegisterUserModel,
    expectedStatus: number,
  ): Promise<RegisterUserModel | ErrorResponseModel> {
    const response = await this.request.post(`${this.baseUrl}/login`, {
      data: user,
    })
    if (response.status() != expectedStatus)
      throw `Response status not ${expectedStatus}`
    const responseJSON = JSON.parse(await response.text())
    if (response.status() >= 400) return responseJSON as ErrorResponseModel
    return responseJSON as RegisterUserModel
  }

  async patchUserData(
    id: number,
    newUserData: CreateUserModel,
  ): Promise<CreateUserModel> {
    const response = await this.request.patch(`${this.baseUrl}/users/${id}`, {
      data: newUserData,
    })
    if (response.status() != 200) throw 'Response status not 200'
    const responseJSON = JSON.parse(await response.text())

    return responseJSON as CreateUserModel
  }

  async putUserData(
    id: number,
    newUserData: CreateUserModel,
  ): Promise<CreateUserModel> {
    const response = await this.request.put(`${this.baseUrl}/users/${id}`, {
      data: newUserData,
    })
    if (response.status() != 200) throw 'Response status not 200'
    const responseJSON = JSON.parse(await response.text())

    return responseJSON as CreateUserModel
  }

  async deleteUser(id: number, expectedStatus: number): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}/users/${id}`)
    if (response.status() != expectedStatus)
      throw `Response status not ${expectedStatus}`
  }
}
