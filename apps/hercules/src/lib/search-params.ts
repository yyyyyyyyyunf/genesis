import { parseAsString, createSearchParamsCache } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  mode: parseAsString.withDefault(''),
});

