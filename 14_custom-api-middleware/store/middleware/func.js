// export const func = (store) => (next) => (action) => {
//     if (typeof action === 'function') {
//       console.log("🔥 func middleware triggered");
//       return action(store.dispatch, store.getState);
//     }
//     return next(action);
//   };
  


export const func = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    console.log('🔥 [func middleware] A thunk function was dispatched:', action);

    const result = action(store.dispatch, store.getState);

    console.log('✅ [func middleware] The thunk function has been executed.');
    return result;
  }

  console.log('📦 [func middleware] A normal action was dispatched:', action);
  return next(action);
};
