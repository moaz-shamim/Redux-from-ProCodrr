export const apiMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const BASE_URL = 'https://fakestoreapi.com'
    if (action.type === 'api/makeCall') {
      next(action)
      const { url, onStart, onSuccess, onError } = action.payload
      dispatch({
        type: onStart,
      })
      fetch(`${BASE_URL}/${url}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: onSuccess,
            payload: data,
          })
        })
        .catch(() => {
          dispatch({
            type: onError,
          })
        })
    } else {
      next(action)
    }
  }

export const fetchData = (payload) => ({ type: 'api/makeCall', payload })




export const func = ({dispatch , getState}) => (next) => (action) => {
  if (typeof action === 'function') {
    console.log("🔥 func middleware triggered");
    return action(dispatch, getState);
  }
  return next(action);
};
