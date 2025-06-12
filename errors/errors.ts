
function createError (name: string): any {
  return class extends Error {
    constructor (message: string) {
      super(message)
      this.name = name
    }
  }
}

export const DatabaseError = createError('databaseError')
