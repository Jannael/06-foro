export function notNullValues (obj: { [key: string]: any }): { [key: string]: any } {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  )
}
