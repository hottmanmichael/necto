import get from './get';
import isEmpty from './is_empty';
import isFunction from './is_function';
import throwIfMissing from './throw_if_missing';

const throwRequiredParamWarning = (
  fullActionValue,
  getterString,
  actionName
) => {
  let action = fullActionValue.type || actionName;
  let message = `${action} expected to contain the parameter "${getterString}" but received the action (${JSON.stringify(
    fullActionValue
  )}) instead.`;
  throw new Error(message);
};

const validateParam = (actionResult, getterString, actionName) => {
  if (!get(actionResult, getterString))
    throwRequiredParamWarning(actionResult, getterString, actionName);
};

const ensureRequiredParameters = ({
  actionName = throwIfMissing('actionName', 'ensureRequiredParameters'),
  actionResult = throwIfMissing('actionResult', 'ensureRequiredParameters'),
  requiredParams = null,
  shouldSilenceErrors = false,
}) => {
  if (isFunction(shouldSilenceErrors) && shouldSilenceErrors()) {
    return actionResult;
  }

  if (isEmpty(requiredParams)) {
    return actionResult;
  }

  if (Array.isArray(requiredParams) && requiredParams.length) {
    requiredParams.forEach(param => {
      try {
        validateParam(actionResult, param, actionName);
      } catch (e) {
        console.error(e);
      }
    });
  }

  return actionResult;
};

export default ensureRequiredParameters;
