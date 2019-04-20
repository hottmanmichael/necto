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
  let nestedValue = get(actionResult, getterString);
  if (nestedValue !== 0 && nestedValue !== false && !nestedValue)
    throwRequiredParamWarning(actionResult, getterString, actionName);
};

const validateEachItemInParamArray = ({
  requiredParams,
  actionResult,
  actionName,
}) => {
  if (Array.isArray(requiredParams) && requiredParams.length) {
    requiredParams.forEach(param => {
      try {
        validateParam(actionResult, param, actionName);
      } catch (e) {
        console.error(e);
      }
    });
  }
};

const ensureRequiredParameters = ({
  actionName = throwIfMissing('actionName', 'ensureRequiredParams'),
  actionResult = throwIfMissing('actionResult', 'ensureRequiredParams'),
  requiredParams = null,
  shouldSilenceErrors = false,
}) => {
  if (isFunction(shouldSilenceErrors) && shouldSilenceErrors()) {
    return actionResult;
  }

  if (isFunction(requiredParams)) {
    requiredParams = requiredParams(actionResult);
  }

  if (isEmpty(requiredParams)) {
    return actionResult;
  }

  if (Array.isArray(requiredParams)) {
    validateEachItemInParamArray({ requiredParams, actionResult, actionName });
  } else {
    const { payload, meta } = requiredParams;
    if (payload && isFunction(payload.map)) {
      const pl = payload.map(p => `payload.${p}`);
      validateEachItemInParamArray({
        requiredParams: pl,
        actionResult,
        actionName,
      });
    }
    if (meta && isFunction(meta.map)) {
      const mt = meta.map(p => `meta.${p}`);
      validateEachItemInParamArray({
        requiredParams: mt,
        actionResult,
        actionName,
      });
    }
  }

  return actionResult;
};

export default ensureRequiredParameters;
