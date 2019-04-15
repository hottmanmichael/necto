const throwIfMissing = (name, source) => {
  throw new Error(`Missing paramter "${name}" in ${source}.`);
};

export default throwIfMissing;
