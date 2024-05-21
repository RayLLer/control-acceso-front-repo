export const convertStringToObject = (keys: string, value: any): any => {
  const result: any = {};
  const keysArray = keys.split('.');
  let currentObject = result;

  for (let i = 0; i < keysArray.length; i++) {
    const key = keysArray[i];

    if (!currentObject[key]) {
      currentObject[key] = {};
    }

    if (i === keysArray.length - 1) {
      currentObject[key] = value;
    }

    currentObject = currentObject[key];
  }

  return result;
};
