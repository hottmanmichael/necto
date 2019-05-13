const throwIfMissing = (name, source) => {
  throw new Error(`Missing parameter "${name}" in ${source}.`);
};

export const throwConditionalIfMissing = (condition, name, source) => {
  condition && throwIfMissing(name, source);
};

export default throwIfMissing;
