import { combineReducers, createStore } from "redux";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import wishListReducer from "./slices/wishListSlice";
import { produce } from "immer";
import { configureStore } from "@reduxjs/toolkit";

// const reducer = combineReducers({
//   products: productsReducer,
//   cartItems: cartReducer,
//   wishList: wishListReducer,
// })

// export const store = createStore(
//   reducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__?.()
// )

// MiddleWare
function logger(store) {
	return function (next) {
		return function (action) {
			console.log("store", store);
			console.log("next", next);
			console.log("action", action);

			return next(action);
		};
	};
}

// More clear Syantax for middlewear
// const logger = (store) => (next) => (action) => {
//   console.log('store: ', store)
//   console.log('next: ', next)
//   console.log('action: ', action)
//   next(action)
// }



export const store = configureStore({
  reducer: {
    products: productsReducer,
    cartItems: cartReducer, 
    wishList: wishListReducer,
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(logger),
})


