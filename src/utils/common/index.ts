import { ISearchParams } from '@/interfaces/params.interface';

export const cleanParams = (params: ISearchParams) => {
  const filteredParams: ISearchParams = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      const filteredArray = value.filter((v) => v !== null && v !== undefined && v !== '');
      if (filteredArray.length > 0) filteredParams[key] = filteredArray;
    } else if (value !== '') {
      filteredParams[key] = value;
    }
  });

  return filteredParams;
};
export function isObject(val: unknown): val is ISearchParams {
  return typeof val === 'object' && val !== null;
}
export const noop = (): void => {};

export const noopAsync = async (): Promise<undefined> => {};
