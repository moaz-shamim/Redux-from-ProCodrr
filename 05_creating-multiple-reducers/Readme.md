<!-- # 📦 Redux Store Setup for E-Commerce State Management

This guide outlines the step-by-step implementation of Redux store logic for an e-commerce app. It manages:
- **Product Catalog** (static product list)
- **Shopping Cart** (add, remove, increment, decrement quantity)
- **Wishlist** (add/remove favorite items)

The following sections explain the code architecture, flow of data, and function of each object and reducer in detail.

---

## 1. Product Data (`productsList.js`)

This file exports a hardcoded list of product objects simulating the backend product catalog.
Each product object includes:

```js
{
  id: 1, // Unique identifier
  title: 'Product Title', // Product name
  price: 109.95, // Product price
  description: 'Short description of the product',
  category: "men's clothing", // Category tag for filtering
  image: 'https://...', // Image URL
  rating: { rate: 3.9, count: 120 } // Customer rating info
}
```

Each object is structured for easy access and expansion within your UI.

---

## 2. Product Reducer (`productsReducer.js`)

The `productsReducer` is responsible for maintaining the product list state. Since this is a static list in our setup, the reducer simply returns the same state on each call:

```js
export default function productsReducer(state = productsList) {
  return state;
}
```

### 🔍 Purpose:
- Acts as a read-only state for rendering product details across your application.
- You could later extend this to support filters, pagination, or async fetch logic.

---

## 3. Cart Reducer (`cartReducer.js`)

This reducer manages cart-related actions. It handles four action types:

### Action Constants:
```js
export const CART_ADD_ITEM = 'cart/addItem';
export const CART_REMOVE_ITEM = 'cart/removeItem';
export const CART_ITEM_INCREASE_QUANTITY = 'cart/increaseItemQuantity';
export const CART_ITEM_DECREASE_QUANTITY = 'cart/decreaseItemQuantity';
```

### Cart Reducer Function:
```js
export default function cartReducer(state = [], action) {
  switch (action.type) {
    case CART_ADD_ITEM:
      return [...state, action.payload];

    case CART_REMOVE_ITEM:
      return state.filter(item => item.productId !== action.payload.productId);

    case CART_ITEM_INCREASE_QUANTITY:
      return state.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case CART_ITEM_DECREASE_QUANTITY:
      return state
        .map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

    default:
      return state;
  }
}
```

### 🔍 Purpose:
- Adds new items to cart with `CART_ADD_ITEM`.
- Removes specific items using `CART_REMOVE_ITEM`.
- Increases/decreases quantity with safety check (removes item when quantity reaches zero).

### 🛒 Cart Item Object Example:
```js
{
  productId: 1, // Matches the product's ID
  quantity: 2   // Tracks number of units added to cart
}
```

---

## 4. Wishlist Reducer (`wishListReducer.js`)

Manages user’s favorite items list using two actions:

### Action Constants:
```js
export const WISHLIST_ADD_ITEM = 'wishList/addItem';
export const WISHLIST_REMOVE_ITEM = 'wishList/removeItem';
```

### Reducer Function:
```js
export default function wishListReducer(state = [], action) {
  switch (action.type) {
    case WISHLIST_ADD_ITEM:
      return [...state, action.payload];

    case WISHLIST_REMOVE_ITEM:
      return state.filter(
        item => item.productId !== action.payload.productId
      );

    default:
      return state;
  }
}
```

### 🔍 Purpose:
- Adds product to favorites.
- Removes it by ID.
- Simple array-based wishlist management.

### ❤️ Wishlist Item Object:
```js
{
  productId: 11 // ID of the favorited product
}
```

---

## 5. Combine Reducers and Create Store (`store.js`)

This is the central file that ties all reducers into one root reducer and sets up the Redux store.

```js
import { combineReducers, createStore } from 'redux';

const reducer = combineReducers({
  products: productsReducer,
  cartItems: cartReducer,
  wishList: wishListReducer,
});

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__?.()
);
```

### 🔍 Purpose:
- `combineReducers` maps state slices to their respective reducers.
- `createStore` initializes the Redux store.
- Redux DevTools enabled for inspection.

Final State Shape:
```js
{
  products: [...],
  cartItems: [...],
  wishList: [...]
}
```

---

## 6. Dispatching Actions

### Examples:
```js
// Add to cart
store.dispatch({ type: CART_ADD_ITEM, payload: { productId: 1, quantity: 1 } });

// Increase quantity
store.dispatch({ type: CART_ITEM_INCREASE_QUANTITY, payload: { productId: 1 } });

// Add to wishlist
store.dispatch({ type: WISHLIST_ADD_ITEM, payload: { productId: 18 } });
```

### Inspecting State:
```js
console.log(store.getState());
```

---

## ✅ Complete Flow Overview

1. **Define product list** in `productsList.js`.
2. **Create reducers** for product, cart, and wishlist.
3. **Combine reducers** into a root reducer.
4. **Create Redux store** with `createStore`.
5. **Dispatch actions** to modify state.
6. **Access state** with `store.getState()`.

---

## 💡 Future Enhancements
- Integrate with React using `react-redux`'s `<Provider>`, `useSelector`, and `useDispatch`.
- Store cart/wishlist in `localStorage`.
- Add async support via `redux-thunk`.
- Build dynamic product fetching via API.

This setup forms the core foundation of any scalable Redux-based e-commerce frontend.



## 7. Action Creators (Optional But Recommended)

To make dispatching easier and more readable, you can define action creators. These are functions that return action objects.

### Example – `decreaseCartItemQuantity` Action Creator:
```js
export function decreaseCartItemQuantity(productId) {
  return {
    type: CART_ITEM_DECREASE_QUANTITY,
    payload: { productId },
  };
}
```

### Usage:
```js
store.dispatch(decreaseCartItemQuantity(12));
```

### ✅ Benefit:
- Keeps your components cleaner.
- Centralizes action definition.
- Easier to maintain and test.

---

## ✅ Complete Flow Overview

1. **Define product list** in `productsList.js`.
2. **Create reducers** for product, cart, and wishlist.
3. **Combine reducers** into a root reducer.
4. **Create Redux store** with `createStore`.
5. **Use action creators** to dispatch actions.
6. **Access state** with `store.getState()`. -->



## 📦 Modular Redux Cart + Wishlist + Products — Project Walkthrough

This project demonstrates a **modular Redux architecture** where state is split into multiple reducers: `productsReducer`, `cartReducer`, and `wishListReducer`. These are combined using Redux’s `combineReducers` method, creating a scalable and organized application state.

---

## 📂 Table of Contents

1. [Project Overview](#project-overview)
2. [Initial Product Setup](#initial-product-setup)
3. [Reducer Structure and combineReducers](#reducer-structure-and-combinereducers)
4. [Action Types & Creators](#action-types--creators)
5. [Reducer Implementations](#reducer-implementations)
6. [Redux Store Configuration](#redux-store-configuration)
7. [Dispatch Workflow](#dispatch-workflow)
8. [Final State Snapshot](#final-state-snapshot)
9. [Takeaways](#takeaways)

---

## 🧠 Project Overview

The project simulates a basic eCommerce-like environment with three key areas of state:

* **Product catalog** from a static JSON list
* **Cart system** with quantity tracking and dynamic item control
* **Wishlist management** with add/remove functionality

Redux is used to centralize and manage all of this in a predictable and scalable way.

---

## 🛒 Initial Product Setup

`productsList.js` exports an array of product objects with:

* `id`
* `title`
* `price`
* `description`
* `category`
* `image`
* `rating: { rate, count }`

```js
export const productsList = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    ...
  },
  ...
];
```

The list is static but simulates an external API.

---

## 🔁 Reducer Structure and combineReducers

Reducers are modularized:

* `productsReducer`: returns the static product list
* `cartReducer`: manages cart actions (add, increase/decrease quantity)
* `wishListReducer`: manages wishlist actions (add/remove)

```js
const reducer = combineReducers({
  products: productsReducer,
  cartItems: cartReducer,
  wishList: wishListReducer,
});
```

> 📌 This keeps state slices isolated and manageable.

---

## 📣 Action Types & Creators

### Cart Actions:

```js
export const CART_ADD_ITEM = 'cart/addItem';
export const CART_ITEM_INCREASE_QUANTITY = 'cart/increaseItemQuantity';
export const CART_ITEM_DECREASE_QUANTITY = 'cart/decreaseItemQuantity';
```

### Wishlist Actions:

```js
export const WISHLIST_ADD_ITEM = 'wishList/addItem';
export const WISHLIST_REMOVE_ITEM = 'wishList/removeItem';
```

### Example Action Creator:

```js
export const decreaseCartItemQuantity = (productId) => ({
  type: CART_ITEM_DECREASE_QUANTITY,
  payload: { productId },
});
```

> 📌 Using action creators improves reusability and readability.

---

## 🧩 Reducer Implementations

### 🛍️ `productsReducer.js`

```js
export default function productsReducer(state = productsList) {
  return state;
}
```

Returns the static product list. No actions needed.

### 🛒 `cartReducer.js`

Handles cart logic:

* `CART_ADD_ITEM`: adds item to cart
* `CART_ITEM_INCREASE_QUANTITY`: increases quantity
* `CART_ITEM_DECREASE_QUANTITY`: decreases quantity, removes if 0

Example logic:

```js
case CART_ITEM_DECREASE_QUANTITY:
  return state
    .map(item => item.productId === action.payload.productId ? {
      ...item,
      quantity: item.quantity - 1,
    } : item)
    .filter(item => item.quantity > 0);
```

### ❤️ `wishListReducer.js`

Simple add/remove reducer:

```js
case WISHLIST_ADD_ITEM:
  return [...state, action.payload];

case WISHLIST_REMOVE_ITEM:
  return state.filter(item => item.productId !== action.payload.productId);
```

---

## 🏪 Redux Store Configuration

```js
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__?.()
);
```

Redux DevTools enabled for easier debugging.

---

## 🚀 Dispatch Workflow

Dispatching various actions to simulate user behavior:

```js
store.dispatch({ type: CART_ADD_ITEM, payload: { productId: 1, quantity: 1 } });
store.dispatch({ type: CART_ADD_ITEM, payload: { productId: 12, quantity: 11 } });
store.dispatch(decreaseCartItemQuantity(12));
store.dispatch({ type: WISHLIST_ADD_ITEM, payload: { productId: 10 } });
```

### Explanation:

* Product 1 and 12 added to cart
* Product 12 quantity is decreased by 1
* Product 10 added to wishlist

---

## 🧾 Final State Snapshot

After the actions above, the state would look something like:

```js
{
  products: [...],
  cartItems: [
    { productId: 1, quantity: 1 },
    { productId: 12, quantity: 10 },
  ],
  wishList: [
    { productId: 10 }
  ]
}
```

---

## ✅ Takeaways

| Concept              | Summary                           |
| -------------------- | --------------------------------- |
| Modular Reducers     | Keeps logic isolated and testable |
| Action Creators      | Simplifies dispatching            |
| combineReducers      | Composes multiple slices of state |
| Static product list  | Simulates external API data       |
| DevTools Integration | Makes state transitions traceable |

> 🎯 This project gives a real-world structure to how Redux is modularized for clean and scalable state management in a frontend app.

Next steps could involve:

* Connecting to a React UI
* Middleware integration (e.g., redux-thunk)
* Async API data fetching via actions
