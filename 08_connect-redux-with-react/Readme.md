## 🧠 Redux Setup in React (Core Concepts Only)

### 📦 What we’re doing:

We are integrating **Redux** into a React application to manage global state like cart, products, etc.
This is achieved using:

* `Provider` from `react-redux`
* A central Redux `store`
* `slices` to modularize state and reducers

---

### 1. **Provider Setup**

```js
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.querySelector('#root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

> ✅ **Purpose:**
> Wraps the root of your React app to provide the Redux store to all child components.
> This is what allows you to use `useSelector()` and `useDispatch()` anywhere inside your component tree.

---

### 2. **Creating the Redux Store**

```js
import { combineReducers, createStore } from 'redux'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import wishListReducer from './slices/wishListSlice'

const reducer = combineReducers({
  products: productsReducer,
  cartItems: cartReducer,
  wishList: wishListReducer,
})

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__?.()
)
```

> ✅ **Concepts Used:**

| Concept                        | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| `combineReducers()`            | Combines multiple slice reducers into a single root reducer. |
| `createStore()`                | Creates the Redux store using the combined reducer.          |
| `__REDUX_DEVTOOLS_EXTENSION__` | Enables Redux DevTools support for easier debugging.         |

---

### 3. **Slice-Based State Management**

Each feature (e.g., cart, wishlist, products) is split into its own **slice file**:

```bash
store/
├── slices/
│   ├── cartSlice.js
│   ├── productsSlice.js
│   └── wishListSlice.js
```

Inside each slice file (manual style or using `createSlice`):

* Define **initial state**
* Define **action types**
* Write **action creators**
* Write **reducer functions**

---

### 🔥 Example: Manual `cartSlice.js`

```js
// Action Types
const CART_ADD_ITEM = 'cart/addItem'

// Action Creator
function addCartItem(product) {
  return { type: CART_ADD_ITEM, payload: product }
}

// Reducer
function cartReducer(state = [], action) {
  switch (action.type) {
    case CART_ADD_ITEM:
      return [...state, action.payload]
    default:
      return state
  }
}

export default cartReducer
```

---

### ✅ Final Notes

* Redux helps manage state **outside of individual components**.
* The store is a **single source of truth** for your entire app.
* `Provider` ensures that every component can access and interact with the store.
* Using **slices** keeps your Redux logic **modular and maintainable**.
