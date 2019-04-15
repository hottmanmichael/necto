export default st => {
  return st && ('string' === typeof st || st instanceof String);
};
