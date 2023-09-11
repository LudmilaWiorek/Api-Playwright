import { test, expect } from '@playwright/test'

test.describe.parallel('Api testing', () => {
  const baseUrl = 'https://reqres.in/api'

  test('Simple API test - Assert response status', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/2`)
    expect(response.status()).toBe(200)

    const responseBody = JSON.parse(await response.text())
    console.log(responseBody.data)
    expect(responseBody.data.first_name).toBe('Janet')
  })

  test('Second test Api - Assert invalid endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/wpiszcokolwiek`)
    expect(response.status()).toBe(404)
  })

  //typical GET request API test:
  test('GET request - GET User detail', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/1`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody.data.id).toBe(1)
    console.log('id =', responseBody.data.id)
    expect(responseBody.data.first_name).toBe('George')
    console.log('first name =', responseBody.data.first_name)
    expect(responseBody.data.last_name).toBe('Bluth')
    console.log('last name =', responseBody.data.last_name)
    expect(responseBody.data.email).toBeTruthy()
  })

  test('GET request - List users', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users?page=2`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody.page).toBe(2)
    console.log(responseBody.per_page)
  })

  test('GET request - Single user not found', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/23`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(404)
    expect(responseBody).toBeTruthy()
    console.log(responseBody)
  })

  test('GET request - List resource', async ({ request }) => {
    const response = await request.get(`${baseUrl}/unknown`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody).toBeTruthy()
    console.log(responseBody)
  })

  test('GET request - Single resource', async ({ request }) => {
    const response = await request.get(`${baseUrl}/unknown/2`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody).toBeTruthy()
    console.log(responseBody.data.id)
  })

  test('GET request - Single resource not found', async ({ request }) => {
    const response = await request.get(`${baseUrl}/unknown/23`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(404)
    expect(responseBody).toBeTruthy()
    console.log(responseBody)
  })

  test('GET Request - Delayed response', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users?delay=3`)
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody).toBeTruthy()
    console.log(responseBody.page)
  })

  //tests POST
  test('POST Request - Create user', async ({ request }) => {
    const response = await request.post(`${baseUrl}/users`, {
      data: {
        name: 'Samsung',
        job: 's8',
      },
    })
    const responseBody = JSON.parse(await response.text())
    console.log(responseBody)
    console.log(response.status())
    expect(responseBody.id).toBeTruthy()
    expect(responseBody.name).toBe('Samsung')
    expect(responseBody.createdAt).toBeTruthy()
  })

  test('POST Request - Register successful', async ({ request }) => {
    const response = await request.post(`${baseUrl}/register`, {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      },
    })
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    console.log(responseBody)
  })

  test('POST Request - Register unsuccessful', async ({ request }) => {
    const response = await request.post(`${baseUrl}/register`, {
      data: {
        password: 'pistol',
      },
    })
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(400)
    console.log(responseBody)
  })

  test('POST Request - Login successful', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    })
    const responseBody = JSON.parse(await response.text())
    console.log(responseBody)
    console.log(response.status())
    expect(response.status()).toBe(200)
    expect(responseBody.token).toBeTruthy()
  })

  test('POST Request - Login fail', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        email: 'eve.holt@reqres.in',
      },
    })
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(400)
    expect(responseBody.error).toBeTruthy()
    console.log(responseBody)
  })

  //test PATCH - OKRESLA TYLKO ZMIANY w przeciwieństwie do PUT, ktore zastępuje cały zasób
  test('PATCH request - Update', async ({ request }) => {
    const response = await request.patch(`${baseUrl}/users/2`, {
      data: {
        name: 'morpheus',
        job: 'zion resident',
      },
    })
    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(200)
    expect(responseBody.job).toBe('zion resident')
    console.log(responseBody.updatedAt)
  })

  //TEST PUT - zastępuje cały zasób
  test('PUT request - Update user', async ({ request }) => {
    const response = await request.put(`${baseUrl}/users/2`, {
      data: {
        name: 'Ludka',
        job: 'Tester Automatyzujący',
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(200)
    expect(responseBody.name).toBe('Ludka')
    expect(responseBody.job).toBe('Tester Automatyzujący')
    expect(responseBody.updatedAt).toBeTruthy()
    console.log(responseBody.name)
    console.log(responseBody.job)
  })

  //test DELETE
  test('DELETE request', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/users/2`)
    expect(response.status()).toBe(204) //kod 204 - brak zawartości
  })

  test('DELETE AND CHECK', async ({ request }) => {
    const responseGet = await request.get(`${baseUrl}/users/2`)
    expect(responseGet.status()).toBe(200)

    const responseDelete = await request.delete(`${baseUrl}/users/2`)
    expect(responseDelete.status()).toBe(204)

    const responseGet2 = await request.get(`${baseUrl}/users/2`) //uwaga na zmianę nazwy const!
  })
})
