import deepmerge from 'deepmerge';
import doCreateFlow from './index';

const defaultDeepmergeOptions = {
  arrayMerge: overrideMerge,
};

const overrideMerge = (destinationArray, sourceArray, options) => sourceArray;
const unionMerge = (destinationArray, sourceArray, options) =>
  _.union([...destinationArray], [...sourceArray]);

export default (createFlow, necto) => {
  const isLoading = createFlow('isLoading', (state, action) => {
    let isLoading = true;
    if (typeof action.id !== 'undefined') {
      return {
        ...state,
        isLoadingById: {
          ...state.isLoadingById,
          [action.id]: isLoading,
        },
      };
    } else {
      return {
        ...state,
        isLoading,
      };
    }
  });

  const isLoadingComplete = createFlow('isLoadingComplete', (state, action) => {
    let isLoading = false;
    if (typeof action.id !== 'undefined') {
      return {
        ...state,
        isLoadingById: {
          ...state.isLoadingById,
          [action.id]: isLoading,
        },
      };
    } else {
      return {
        ...state,
        isLoading,
      };
    }
  });

  const mergeDataFromApi = createFlow(
    {
      name: 'mergeDataFromApi',
      type: 'MERGE_DATA_FROM_API',
    },
    (state, action) => {
      if (!action.payload[necto.name]) return state;
      if (
        action.options &&
        Array.isArray(action.options.include) &&
        action.options.include.indexOf(key) === -1
      ) {
        return state;
      }
      let byId = deepmerge(state.byId, action.payload[key], mergeOptions);
      return {
        ...state,
        byId,
      };
    },
    {
      requiredParams: ['payload'],
    }
  );

  return [isLoading, isLoadingComplete, mergeDataFromApi];
};
