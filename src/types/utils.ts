/**
 * Ensures that all keys of the given type are present in the record.
 *
 * Example: EnsureAllKeysPresent<ViewerActionType, _ViewerActionParams>
 * will return the type _ViewerActionParams but with all the keys of ViewerActionType present.
 * If a key is not present, the type will throw a linter error.
 */
export type EnsureAllKeysPresent<
  Keys extends string | number | symbol,
  T extends Record<Keys, unknown>,
> = T;
