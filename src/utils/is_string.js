export default st => {
  return !!(
    'undefined' !== st &&
    ('string' === typeof st || st instanceof String)
  );
};
