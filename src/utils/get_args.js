import isFunction from './is_function';

export default function getArgs(func) {
  if (!isFunction(func)) return [];

  // First match everything inside the function argument parens.
  var args = func.toString().match(/\s.*?\(([^)]*)\)/)[1];
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')
    .map(function(arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter(function(arg) {
      // Ensure no undefined values are added.
      return arg;
    });
}
