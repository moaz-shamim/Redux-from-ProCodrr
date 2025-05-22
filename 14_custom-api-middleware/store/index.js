import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import wishListReducer from './slices/wishListSlice'
import { configureStore   } from '@reduxjs/toolkit'
import { apiMiddleware, func } from './middleware/api'


export const store = configureStore({
  reducer: {
    products: productsReducer,
    cartItems: cartReducer,
    wishList: wishListReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiMiddleware),

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true})
    .concat(apiMiddleware ), 
})
