## 🛒 Redux Cart & Wishlist State Management — Full Breakdown

This project showcases a Redux-based state management system for a product cart and wishlist. The implementation uses a root reducer, static product data, and several Redux actions to manipulate the `cartItems` and `wishList` arrays in global state.

---

## 📂 Table of Contents

1. [Project Overview](#project-overview)
2. [Product Data Setup](#product-data-setup)
3. [Initial State Structure](#initial-state-structure)
4. [Action Type Constants](#action-type-constants)
5. [Reducer Logic](#reducer-logic)
6. [Redux Store Creation](#redux-store-creation)
7. [Dispatching Actions](#dispatching-actions)
8. [State Output & Flow Explanation](#state-output--flow-explanation)
9. [Summary](#summary)

---

## 🧠 Project Overview

This project helps manage complex state for a product-based application (like an eCommerce app) using Redux. The features implemented:

* Add/remove items to/from cart
* Increase/decrease item quantity in cart
* Add/remove items from wishlist

All of this is handled through a central Redux store.

---

## 📦 Product Data Setup

Products are stored in a static array `productsList` which is imported and used in the Redux initial state. Each product object contains:

* `id`
* `title`
* `price`
* `description`
* `category`
* `image`
* `rating` (with `rate` and `count`)

This array simulates an API response.

---

## 🛠 Initial State Structure

```js
const initialState = {
  products: productsList,
  cartItems: [],
  wishList: [],
};
```

The app tracks three main slices of state:

1. **products** — full list from `productsList`
2. **cartItems** — items added to cart (with quantity)
3. **wishList** — items added to wishlist

---

## 🏷️ Action Type Constants

```js
const CART_ADD_ITEM = 'cart/addItem';
const CART_REMOVE_ITEM = 'cart/removeItem';
const CART_ITEM_INCREASE_QUANTITY = 'cart/increaseItemQuantity';
const CART_ITEM_DECREASE_QUANTITY = 'cart/decreaseItemQuantity';
const WISHLIST_ADD_ITEM = 'wishList/addItem';
const WISHLIST_REMOVE_ITEM = 'wishList/removeItem';
```

These constants improve maintainability and prevent typos in action types.

---

## 🔁 Reducer Logic

The reducer is a **pure function** that returns a new state based on the action type:

### Add Item to Cart

```js
case CART_ADD_ITEM:
  return {
    ...state,
    cartItems: [...state.cartItems, action.payload],
  };
```

Adds a product to `cartItems`.

### Remove Item from Cart

```js
case CART_REMOVE_ITEM:
  return {
    ...state,
    cartItems: state.cartItems.filter(
      (cartItem) => cartItem.productId !== action.payload.productId
    ),
  };
```

Removes an item by `productId`.

### Increase Item Quantity

```js
case CART_ITEM_INCREASE_QUANTITY:
  return {
    ...state,
    cartItems: state.cartItems.map((cartItem) =>
      cartItem.productId === action.payload.productId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    ),
  };
```

### Decrease Quantity (Remove if Quantity is 0)

```js
case CART_ITEM_DECREASE_QUANTITY:
  return {
    ...state,
    cartItems: state.cartItems
      .map((cartItem) =>
        cartItem.productId === action.payload.productId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0),
  };
```

### Add to Wishlist

```js
case WISHLIST_ADD_ITEM:
  return {
    ...state,
    wishList: [...state.wishList, action.payload],
  };
```

### Remove from Wishlist

```js
case WISHLIST_REMOVE_ITEM:
  return {
    ...state,
    wishList: state.wishList.filter(
      (wishListItem) => wishListItem.productId !== action.payload.productId
    ),
  };
```

---

## 🏪 Redux Store Creation

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());
```

This enables full access to the state tree and Redux DevTools for debugging.

---

## 🚀 Dispatching Actions

### Sample Sequence:

```js
store.dispatch({ type: CART_ADD_ITEM, payload: { productId: 1, quantity: 1 } });
store.dispatch({ type: CART_ADD_ITEM, payload: { productId: 12, quantity: 1 } });
store.dispatch({ type: CART_ITEM_INCREASE_QUANTITY, payload: { productId: 12 } });
store.dispatch({ type: CART_ITEM_DECREASE_QUANTITY, payload: { productId: 12 } });
store.dispatch({ type: CART_ITEM_DECREASE_QUANTITY, payload: { productId: 12 } });
store.dispatch({ type: WISHLIST_ADD_ITEM, payload: { productId: 18 } });
store.dispatch({ type: WISHLIST_ADD_ITEM, payload: { productId: 11 } });
store.dispatch({ type: WISHLIST_REMOVE_ITEM, payload: { productId: 11 } });
store.dispatch({ type: WISHLIST_REMOVE_ITEM, payload: { productId: 18 } });
```

Each dispatch goes through the reducer and updates the state accordingly.

---

## 📊 State Output & Flow Explanation

1. Add product 1 and 12 to cart → two items in `cartItems`
2. Increase quantity of product 12 → quantity becomes 2
3. Decrease quantity twice → item removed (quantity drops to 0)
4. Add product 18 and 11 to `wishList`
5. Remove both items from `wishList`

### Final State Shape:

```js
{
  products: [...],
  cartItems: [ { productId: 1, quantity: 1 } ],
  wishList: []
}
```

---

## ✅ Summary

| Feature          | Behavior                           |
| ---------------- | ---------------------------------- |
| Add to cart      | Adds item with quantity            |
| Remove from cart | Removes by `productId`             |
| Adjust quantity  | Increase or decrease item quantity |
| Auto-remove      | If quantity = 0, remove from cart  |
| Add to wishlist  | Appends to `wishList`              |
| Remove wishlist  | Filters out matching item          |

🎯 This implementation covers essential Redux patterns for a shopping cart-like system with clear reducer logic and action management.

Next steps could include:

* UI rendering based on state
* Preventing duplicates in cart/wishlist
* Middleware for async actions
