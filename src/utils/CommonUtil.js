export const waitingMillSeconds = (millSeconds) => new Promise(a => setTimeout(a, millSeconds));

export const generateDefaultQueryParams = (current = 1, pageSize = 10) => {
  return (() => {
    const pageSizeField = 'pageSize';
    const currentField = 'current';
    let currentVal = current;
    let pageSizeVal = pageSize;
    return {
      getCriteria () {
        return {
          [pageSizeField]: pageSizeVal, [currentField]: currentVal
        };
      },
      getPageSize () {
        return pageSizeVal;
      },
      setPageSize (size) {
        pageSizeVal = size;
      },
      setCurrent (current) {
        currentVal = current;
      },
      getCurrent () {
        return currentVal;
      },
      setNextCurrent () {
        currentVal += 1;
      }
    };
  })();
};

export const to = (promise) => {
  return new Promise(resolve => {
    promise.then(res => resolve([null, res]))
      .catch(err => {
        resolve([err, null]);
      });
  });
};
