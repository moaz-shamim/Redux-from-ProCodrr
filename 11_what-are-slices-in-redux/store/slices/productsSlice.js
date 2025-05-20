import { productsList } from '../productsList'

export default function productsReducer(state = productsList , action) {
  console.log('[productsReducer] received action:', action.type)
  return state
}
