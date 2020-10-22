import immutable from 'immutable';

export const isImmutable = immutable.Iterable.isIterable;

export const immuablize = (data) => {
  if (data && !isImmutable(data)) {
    return immutable.fromJS(data);
  }
  return data;

};
export const plainlize = (data) => {
  if (isImmutable(data)) {
    return data.toJS();
  }
  return data;
};
