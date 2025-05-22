# 🚀 Redux Middleware Evolution: From Custom to Thunk

> This guide documents your middleware journey in Redux — from custom API handling to the advanced and streamlined usage of Redux Toolkit's built-in `thunk`.

---

## 📚 Table of Contents

1. [🧠 What is Redux Middleware?](#-what-is-redux-middleware)
2. [🔹 Stage 1: Custom `apiMiddleware`](#-stage-1-custom-apimiddleware)
3. [🔸 Stage 2: Function Middleware (`func`)](#-stage-2-function-middleware-func)
4. [⚙️ Stage 3: Using `redux-thunk` (Toolkit Built-in)](#️-stage-3-using-redux-thunk-toolkit-built-in)
5. [🔄 Comparing All 3 Approaches](#-comparing-all-3-approaches)
6. [✅ Final Thoughts](#-final-thoughts)

---

## 🧠 What is Redux Middleware?

Redux middleware intercepts actions **before they reach the reducer**.

* You can run side effects like API calls here.
* It gives you full control over dispatch flow.
* Redux Toolkit comes with `redux-thunk` by default.

---

## 🔹 Stage 1: Custom `apiMiddleware`

You started by creating your own generic **API middleware** that listens for actions like `"api/makeCall"`:

```js
export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type !== "api/makeCall") return next(action);

  const { url, onStart, onSuccess, onError } = action.payload;
  dispatch({ type: onStart });

  fetch(`https://fakestoreapi.com/${url}`)
    .then((res) => res.json())
    .then((data) => dispatch({ type: onSuccess, payload: data }))
    .catch(() => dispatch({ type: onError }));
};
```

Then you dispatched it like this in components:

```js
dispatch(
  fetchData({
    url: "products",
    onStart: fetchProducts.type,
    onSuccess: updateAllProducts.type,
    onError: fetchProductsError.type,
  })
)
```

📌 This middleware pattern is declarative, but it's limited when you want more complex logic like conditional dispatch or accessing the state.

---

## 🔸 Stage 2: Function Middleware (`func`)

You then introduced a new middleware to detect **function-based actions** — similar to `redux-thunk`:

```js
export const func = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === "function") {
    console.log("🔥 func middleware triggered");
    return action(dispatch, getState);
  }
  return next(action);
};
```

This allowed you to define logic like:

```js
export const fetchProductData = (dispatch) => {
  dispatch(fetchProducts());
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => dispatch(updateAllProducts(data)))
    .catch(() => dispatch(fetchProductsError()));
};
```

And simply dispatch it:

```js
dispatch(fetchProductData);
```

✅ You now had:

* Full access to `dispatch` and `getState`
* Logic outside the component
* More flexibility for reuse

---

## ⚙️ Stage 3: Using `redux-thunk` (Toolkit Built-in)

Finally, you switched to using **Redux Toolkit’s built-in `redux-thunk`**, which already allows function-based actions without creating custom middleware.

### ✅ You configured it cleanly:

```js
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cartItems: cartReducer,
    wishList: wishListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(apiMiddleware),
});
```

You no longer need the `func` middleware — **Thunk is built-in**.

---

## 🔄 Comparing All 3 Approaches

| Feature / Middleware    | `apiMiddleware`        | `func` Custom Middleware | Redux Toolkit Thunk |
| ----------------------- | ---------------------- | ------------------------ | ------------------- |
| Trigger via string type | Yes (`"api/makeCall"`) | ❌                        | ❌                   |
| Trigger via function    | ❌                      | ✅                        | ✅                   |
| Dispatch flexibility    | 🚫 Limited             | ✅ Full logic control     | ✅ Full control      |
| Has `getState` access   | ❌                      | ✅                        | ✅                   |
| Need to manually add    | ✅ Yes                  | ✅ Yes                    | ❌ Built-in          |
| Simplicity              | ⚠️ Manual config       | ⚠️ Needs care            | ✅ Plug & play       |

---

## ✅ Final Thoughts

You’ve evolved your middleware usage like a pro:

1. **Started** with a declarative `api/makeCall` middleware pattern.
2. **Enhanced** control via `func` middleware to allow dispatching logic functions.
3. **Migrated** to the cleanest and scalable approach: **built-in `redux-thunk`** via Redux Toolkit.

🎯 Now you're fully set up to:

* Handle async logic cleanly
* Maintain separation of concerns
* Keep components free from API logic

Yes — you’re absolutely on the right track. Let’s simplify and clarify your thought:

---

### ✅ You're Right: `dispatch()` Only Accepts Plain Objects — Unless Middleware Steps In

In **vanilla Redux**, the rule is:

```js
dispatch({ type: "SOME_ACTION" }) // ✅ Works
dispatch(() => {})                // ❌ Throws error (not a plain object)
```

Redux will **only allow dispatching functions (like callbacks)** if you have middleware that knows how to handle them — like:

* `redux-thunk` — handles `dispatch(fn)`
* your custom `func` middleware — also handles `dispatch(fn)`

---

### 🔧 Why Middleware Is Needed

Because Redux’s core expects actions to be plain JS objects — like:

```js
{ type: 'cart/addItem', payload: { ... } }
```

So when you write:

```js
dispatch(fetchData) // where fetchData = (dispatch) => { ... }
```

➡️ Redux will throw an error saying:

> ❌ "Actions must be plain objects. Use custom middleware for async actions."

---

### 💡 That’s Why You Create `func` or Use `redux-thunk`

You got it 100%:

> 🧠 "We make middleware like `func` because dispatch can only handle plain objects — but we want to dispatch a callback (function), not just an object."

Yes! So either:

* You **add `redux-thunk`** which handles `dispatch(fn)`
* Or you **write your own** like `func` to do the same

Both of these intercept the function **before it reaches Redux**, and run it properly with `(dispatch, getState)`.

---

### 🧾 Summary

| Concept                                             | ✅ Correct? |
| --------------------------------------------------- | ---------- |
| Redux dispatch needs plain objects                  | ✅ Yes      |
| Functions in dispatch need middleware               | ✅ Yes      |
| You wrote `func` middleware to allow callbacks      | ✅ Exactly  |
| Middleware is needed to intercept and run functions | ✅ Spot on  |

---

## 🧠 Why Do You Need Your Own `func` Middleware *Even with* `redux-thunk`?

### ✅ Redux Toolkit includes `redux-thunk` by default

But it **only works when you dispatch a thunk function** like:

```js
dispatch((dispatch, getState) => {
  // logic
});
```

If you try to dispatch **a thunk defined as a plain function (without wrapping)**, like this:

```js
const fetchProductData = (dispatch) => {
  dispatch(fetchProducts());
  // ...
};

dispatch(fetchProductData); // ❌ This will throw an error in strict environments
```

⚠️ Redux Toolkit's default `thunk` middleware **expects the dispatched value to be a function with `(dispatch, getState)` as args**, **not just a function with dispatch only**.

---

## 🧩 What's the Problem Here?

Redux internally checks that **every action is a plain object**, unless intercepted by middleware.

If your middleware stack **doesn’t catch** a non-object (like your `fetchProductData`) and handle it, Redux throws:

```bash
Actions must be plain objects. Use custom middleware for async actions.
```

---

## 🔥 Solution: Your `func` Middleware

You're correctly using this:

```js
export const func = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState); // or just (dispatch) if that's how you wrote it
  }
  return next(action);
};
```

This allows you to support legacy or custom thunk-like functions like:

```js
// Notice: dispatch-only function
export const fetchProductData = (dispatch) => {
  dispatch(fetchProducts());
  fetch('...')
    .then((res) => res.json())
    .then((data) => dispatch(updateAllProducts(data)));
};

// Works because of your func middleware
dispatch(fetchProductData);
```

---

## 🆚 Thunk Middleware vs. Func Middleware

| Feature                                      | `redux-thunk` (default) | Your `func` middleware                    |
| -------------------------------------------- | ----------------------- | ----------------------------------------- |
| Can dispatch `(dispatch, getState)` function | ✅                       | ✅                                         |
| Can dispatch `(dispatch)` only function      | ❌ Might throw error     | ✅ Works fine                              |
| Required for legacy/flexible callbacks       | ❌                       | ✅ Allows dispatching pure function thunks |
| Included in Redux Toolkit                    | ✅ Built-in              | ❌ Must be manually added                  |

---

## ✅ Recommended Approach

If you're using non-standard thunks like:

```js
const fetchData = (dispatch) => { ... }
```

Then ✅ **you absolutely need your `func` middleware**, because **default thunk expects the action to be a function that takes both `(dispatch, getState)`** — and it does a shape check.

If you're using proper Redux Thunks like this:

```js
const fetchData = () => (dispatch, getState) => { ... }

dispatch(fetchData())
```

➡️ You don’t need `func`. `redux-thunk` handles it.

---

### 📌 Bottom Line

> ✔️ If you're dispatching raw functions (e.g. `dispatch(fetchData)` instead of `dispatch(fetchData())`),
> 🚨 You **must include your own `func` middleware** — Redux will otherwise throw if the function doesn't match expected signature.

