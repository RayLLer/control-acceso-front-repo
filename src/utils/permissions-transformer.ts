export const groupBy = (xs, f) => {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
};

export const transformPermissions = (permissionsObject: any) => {
  const routes = [];

  for (const apiGroup of Object.values(permissionsObject) as any) {
    for (const apiName in apiGroup.controllers) {
      const controllerMethods = apiGroup.controllers[apiName];
      for (const methodName in controllerMethods) {
        if (controllerMethods[methodName].enabled) {
          routes.push({
            name: `${apiName} - ${methodName}`,
            base: apiName,
            method: methodName,
          });
        }
      }
    }
  }
  return routes;
};
