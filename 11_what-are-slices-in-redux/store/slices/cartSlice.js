import { createSlice } from "@reduxjs/toolkit"
import { produce } from "immer"

// Action Types
export const CART_ADD_ITEM = 'cart/addItem'
const CART_REMOVE_ITEM = 'cart/removeItem'
const CART_ITEM_INCREASE_QUANTITY = 'cart/increaseItemQuantity'
const CART_ITEM_DECREASE_QUANTITY = 'cart/decreaseItemQuantity'

// Action Creators
// export function addCartItem(productData) {
//   return { type: CART_ADD_ITEM, payload: productData }
// }

// export function removeCartItem(productId) {
//   return { type: CART_REMOVE_ITEM, payload: { productId } }
// }

// export function decreaseCartItemQuantity(productId) {
//   return {
//     type: CART_ITEM_DECREASE_QUANTITY,
//     payload: { productId },
//   }
// }

// export function increaseCartItemQuantity(productId) {
//   return {
//     type: CART_ITEM_INCREASE_QUANTITY,
//     payload: { productId },
//   }
// }

// Reducer implemented with the help of redux
// export default function cartReducer(state = [], action) {
//   console.log('[cartReducer] received action:', action.type)


//   switch (action.type) {
//     case CART_ADD_ITEM:
//       const existingItem = state.find(
//         (cartItem) => cartItem.productId === action.payload.productId
//       )
//       if (existingItem) {
//         return state.map((cartItem) => {
//           if (cartItem.productId === existingItem.productId) {
//             return { ...cartItem, quantity: cartItem.quantity + 1 }
//           }
//           return cartItem
//         })
//       }
//       return [...state, { ...action.payload, quantity: 1 }]
//     case CART_REMOVE_ITEM:
//       return state.filter(
//         (cartItem) => cartItem.productId !== action.payload.productId
//       )
//     case CART_ITEM_INCREASE_QUANTITY:
//       return state.map((cartItem) => {
//         if (cartItem.productId === action.payload.productId) {
//           return { ...cartItem, quantity: cartItem.quantity + 1 }
//         }
//         return cartItem
//       })

//     case CART_ITEM_DECREASE_QUANTITY:
//       return state
//         .map((cartItem) => {
//           if (cartItem.productId === action.payload.productId) {
//             return { ...cartItem, quantity: cartItem.quantity - 1 }
//           }
//           return cartItem
//         })
//         .filter((cartItem) => cartItem.quantity > 0)
//     default:
//       return state
//   }
// }


const findIndex = (state,action) => {
  return state.findIndex((cartItem) => (cartItem.productId === action.payload.productId))
}


// Reducer implemented with the help of redux-toolkit
// export default function cartReducer(originalState = [], action) {
function cartReducer(originalState = [], action) {
  
  return produce(originalState , (state) => {
    const existingItemIndex = state.findIndex((cartItem) => (cartItem.productId === action.payload.productId))
    switch (action.type) {

      case CART_ADD_ITEM:
        if(existingItemIndex !== -1){
         state[existingItemIndex].quantity += 1;
         break
        }
        state.push({...action.payload , quantity : 1})
         break

      case CART_REMOVE_ITEM:
        state.splice(existingItemIndex,1)
        break
      
      case CART_ITEM_INCREASE_QUANTITY:
        state[existingItemIndex].quantity += 1;
        break 
        
      case CART_ITEM_DECREASE_QUANTITY:
        state[existingItemIndex].quantity -= 1;
        if (state[existingItemIndex].quantity === 0) state.splice(existingItemIndex,1)
      
      default:
        return state
    }

  })

  
}



const slice  = createSlice({
  name:"cart",
  initialState:[],
  reducers: {
    addCartItem(state , action){
      const existingItemIndex = findIndex(state,action)
      if(existingItemIndex !== -1){
        state[existingItemIndex].quantity += 1;
      }else{
        state.push({...action.payload , quantity : 1});
      }
    },
    removeCartItem(state,action){
      const existingItemIndex = findIndex(state,action)
      state.splice(existingItemIndex,1)
    },
    increaseCartItemQuantity(state,action){
      const existingItemIndex = findIndex(state,action)
      state[existingItemIndex].quantity += 1;
    },
    decreaseCartItemQuantity(state , action){
      const existingItemIndex = findIndex(state,action)
      state[existingItemIndex].quantity -= 1;
        if (state[existingItemIndex].quantity === 0) state.splice(existingItemIndex,1)
    }
  }
})


export const {addCartItem , removeCartItem , decreaseCartItemQuantity , increaseCartItemQuantity} =  slice.actions
export default slice.reducer

console.log("slice",slice);
