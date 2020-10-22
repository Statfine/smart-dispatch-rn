import { useSelector } from 'react-redux';
import { immuablize } from '../utils/ImmutableUtil';

export function useReduxByPath (path, defaultVal) {
  const data = useSelector(state => state.getIn(path));
  return data || immuablize(defaultVal);
}
