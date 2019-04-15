export default fn => {
  return (
    (fn && {}.toString.call(fn) === '[object Function]') ||
    {}.toString.call(fn) === '[object GeneratorFunction]'
  );
};

export const isGeneratorFunction = fn => {
  return fn && {}.toString.call(fn) === '[object GeneratorFunction]';
};
