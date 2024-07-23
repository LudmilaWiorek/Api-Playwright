import { expect, test } from '@playwright/test'
import { ApiPage } from '../../page-object-4-API/APIPage'
import {
  CreateUserModel,
  RegisterUserModel,
} from '../../interface/APIinterface.model'

test.describe.parallel('Api testing', () => {
  let apiClass: ApiPage
  test.beforeEach('create apiClass for all tests', ({ request }) => {
    apiClass = new ApiPage(request)
  })

  test('Simple API test - Assert response status', async () => {
    const responseBody = await apiClass.getUserById(2, 200)
    // expect(response.status()).toBe(200); // this functionality packed in method of class
    expect(responseBody.data.first_name).toBe('Janet')
  })

  test('Second test Api - Assert invalid endpoint', async () => {
    //we check if we got status 404 when request to wrong endpoint (web)
    const response = await apiClass.getFailedEndpoint()
    expect(response.status()).toBe(404)
  })

  //typical GET request API test:
  test('GET request - GET User detail', async () => {
    // we do the same as in the first test, we use the same method
    // of our class; status we check in method!
    const userDataResponseBody = await apiClass.getUserById(1, 200)
    expect(userDataResponseBody.data.id).toBe(1)
    expect(userDataResponseBody.data.first_name).toBe('George')
    expect(userDataResponseBody.data.last_name).toBe('Bluth')
    expect(userDataResponseBody.data.email).toBeTruthy()
    // don't make assertion toBeTruthy
  })

  test('GET request - List users', async () => {
    const userListResponseBody = await apiClass.getUserList(2)
    expect(userListResponseBody.page).toBe(2)
    expect(userListResponseBody.data[2].last_name).toBe('Funke')
  })

  test('GET request - Single user not found', async () => {
    const response = await apiClass.getUserById(23, 404)
    expect(response).toBeTruthy()
  })

  test('GET request - List resource', async () => {
    const listResourceBody = await apiClass.getListResource()
    expect(listResourceBody.total).toBe(12)
    // I check number of elements because the rule says when I add a resource for a test,
    // I delete it after (if database works as it should)
    const propertyList = ['id', 'name', 'year', 'color', 'pantone_value']
    listResourceBody.data.forEach((resource) => {
      propertyList.forEach((key) => {
        expect.soft(resource).toHaveProperty(key)
      })
    })
// nice loop to check properties of resources closed in list of data in listResourceBody

  })

  test('GET request - Single resource', async () => {
    const singleResourceBody = await apiClass.getResourceById(2, 200)
    expect(singleResourceBody.data.name).toBe('fuchsia rose')
  })

  test('GET request - Single resource not found', async () => {
    const singleResourceBody = await apiClass.getResourceById(23, 404)
    expect(singleResourceBody).toBeTruthy()
  })

  test('GET Request - Delayed response', async () => {
    const delayedResponse = await apiClass.getDelayedResponse(3)
    expect(delayedResponse.data[0].first_name).toBe('George')
    // make worthful assertions!!!
  })

  //TESTS POST
  test('POST Request - Create user', async () => {
    // here should be confirmation that the number of users is <number>
    const newUser: CreateUserModel = {
      name: 'Samsung',
      job: 's8',
    }
    const postResponse = await apiClass.createUser(newUser)
    console.log(postResponse)
    // check if createdAt works when parameter in interface is optional
    expect(postResponse.id).toBeTruthy()
    expect(postResponse.name).toBe('Samsung')
    expect(postResponse.createdAt).toBeTruthy()
    // here we check if <number> of users changed!
  })

  test('POST Request - Register successful', async () => {
    const newUser: RegisterUserModel = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    }
    const postResponse = await apiClass.registerNewUser(newUser, 200)
    console.log(postResponse)
    console.log(typeof postResponse)
    expect(postResponse).toHaveProperty('id')
    expect(postResponse).toHaveProperty('token')
  })

  test('POST Request - Register unsuccessful', async () => {
    const newUser: RegisterUserModel = {
      email: 'sydney@fife',
    }
    const postResponse = await apiClass.registerNewUser(newUser, 400)
    console.log(postResponse)
    expect(postResponse).toHaveProperty('error')
    expect(postResponse.error).toBe('Missing password')
  })

  test('POST Request - Login successful', async () => {
    const user: RegisterUserModel = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    }
    const postResponse = await apiClass.loginUser(user, 200)
    console.log(postResponse)
    expect(postResponse.token).toBe('QpwL5tke4Pnpja7X4')
  })

  test('POST Request - Login fail', async () => {
    const user: RegisterUserModel = {
      email: 'eve.holt@reqres.in',
    }
    const postResponse = await apiClass.loginUser(user, 400)
    console.log(postResponse)
    expect(postResponse.error).toBe('Missing password')
  })

  //TEST PATCH - specifies only changes unlike Put which replaces entire resource
  test('PATCH request - Update', async () => {
    const patchedUserData: CreateUserModel = {
      name: 'morpheus',
      job: 'zion resident',
    }
    console.log(patchedUserData)
    const postResponse = await apiClass.patchUserData(2, patchedUserData)
    console.log(postResponse)

    //we check in assertion if updatedAt parameter is actual
    let date = new Date()
    let responseDate = new Date(postResponse.updatedAt)
    // in interface CreateUserModel option updateAt is optional :)

    let timeDifference = date.getTime() - responseDate.getTime()
    expect(timeDifference).toBeLessThan(5000)
  })

  //TEST PUT - replaces entire resource
  test('PUT request - Update user', async () => {
    const putUserData: CreateUserModel = {
      name: 'sth',
      job: 'sth different',
    }
    const putResponse = await apiClass.putUserData(2, putUserData)
    expect(putResponse.updatedAt).toBeTruthy()
  })

  //TESTS DELETE
  test('DELETE request', async () => {
    await apiClass.deleteUser(2, 204)
    // no assertion ;|
  })

  test('DELETE AND CHECK', async () => {
    let responseBody = await apiClass.getUserById(2, 200)
    expect(responseBody.data.id).toBe(2)
    console.log(responseBody)
    await apiClass.deleteUser(2, 204)
    responseBody = await apiClass.getUserById(2, 200) // code response should be 404! NOT 200
  })
})
