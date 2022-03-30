exports.compose =
  (...fns) =>
  (x) =>
    fns.reduce((res, fn) => fn(res), x);
