const getInitialState = (initialState = {}) => ({
  isLoading: false,
  isLoadingById: {},
  byId: {},
  ...initialState,
});

export default getInitialState;
