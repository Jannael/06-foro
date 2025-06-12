
function createError (name: string): any {
  return class extends Error {
    constructor (message: string) {
      super(message)
      this.name = name
    }
  }
}

export const DatabaseError = createError('databaseError')
export const MissingDataError = createError('missingDataError')
export const DuplicateEntryError = createError('duplicateEntryError')
