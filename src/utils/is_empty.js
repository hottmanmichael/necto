// Polyfill for Object.entries
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
const entries = function(obj) {
  var ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i);
  while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
  return resArray;
};

const isValidTypeofObject = obj =>
  [Object, Array].includes((obj || {}).constructor);

const isEmpty = obj => {
  // Objects are considered empty if they have no own enumerable string keyed properties.
  if (!isValidTypeofObject(obj)) return true;
  return !entries(obj || {}).length;
};

export default isEmpty;
