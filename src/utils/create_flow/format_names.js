import Case from 'case';
import isString from '../is_string';

const formatActionNamesFromString = (name, reducerKey, options) => {
  const actionName = Case.camel(name);
  let constantKey = Case.constant(name);

  if (options && options.async) {
    constantKey = `[SAGA]/${constantKey}`;
  }

  const actionType = `${reducerKey}/${constantKey}`;

  return { actionName, actionType, constantKey };
};

const formatActionNamesFromObject = (nameObject, reducerKey, options) => {
  let { name, type, merge } = nameObject;
  if (nameObject.merge) {
    type = `${reducerKey}/${type}`;
  }
  return { actionName: name, actionType: type, constantKey: type };
};

const matchesNameObjectConvention = obj => {
  return (
    obj &&
    obj.hasOwnProperty &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('type')
  );
};

export const formatActionNames = (name, reducerKey, options = {}) => {
  if (isString(name))
    return formatActionNamesFromString(name, reducerKey, options);
  else if (matchesNameObjectConvention(name))
    return formatActionNamesFromObject(name, reducerKey, options);
  else {
    throw new Error(
      `Invalid param used in ${reducerKey}.createFlow - Expected String or {name, type} but received ${name} instead.`
    );
  }
};
