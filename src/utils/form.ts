type DirtyFields<T> = {
  [K in keyof T]?: boolean | DirtyFields<T[K]>;
};

export function pickDirtyValues<T extends Record<string, unknown>>(
  values: T,
  dirtyFields: DirtyFields<T>
) {
  const result = Object.keys(dirtyFields).reduce<Record<string, unknown>>((accumulator, key) => {
    const typedKey = key as keyof T;
    const dirtyValue = dirtyFields[typedKey];

    if (!dirtyValue) {
      return accumulator;
    }

    accumulator[key] =
      typeof dirtyValue === 'object' && dirtyValue !== null
        ? pickDirtyValues(values[typedKey] as Record<string, unknown>, dirtyValue)
        : values[typedKey];

    return accumulator;
  }, {});

  return result as Partial<T>;
}
