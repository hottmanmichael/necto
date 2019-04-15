const entries = function(obj) {
  var ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i);

  while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
  return resArray;
};

const isEmpty = obj =>
  [Object, Array].includes((obj || {}).constructor) &&
  !entries(obj || {}).length;

export default isEmpty;
