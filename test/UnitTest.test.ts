import { sendEmail } from '../utils/utils'

describe('Unit Test', () => {
  test('sendEmail', async () => {
    const email = 'floo234.clashroyale@gmail.com'
    const code = 1234
    const response = await sendEmail(email, code)
    expect(response).toBe(true)
  })
})
