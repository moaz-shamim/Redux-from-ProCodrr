# 🌐 Redux Middleware-Based API Calling — Step-by-Step Notes

> This guide explains how you evolved your API call logic from raw `fetch()` to **middleware-driven Redux API calls**, in **three progressive stages**.

---

## 📚 Table of Contents

1. [🔹 Stage 1: Direct API Calls inside `useEffect`](#-stage-1-direct-api-calls-inside-useeffect)
2. [🔸 Stage 2: Dispatching API Actions with a Custom Middleware](#-stage-2-dispatching-api-actions-with-a-custom-middleware)
3. [🚀 Stage 3: Abstracting API Call Dispatch with `fetchData()` Helper](#-stage-3-abstracting-api-call-dispatch-with-fetchdata-helper)
4. [⚙️ apiMiddleware: How It Works](#️-apimiddleware-how-it-works)
5. [✅ Benefits of This Evolution](#-benefits-of-this-evolution)
6. [🔚 Final Notes](#-final-notes)

---

## 🔹 Stage 1: Direct API Calls inside `useEffect`

At first, your component (`Header.js`) directly performed API calls using `fetch()` and dispatched actions manually:

```js
useEffect(() => {
  dispatch(fetchProducts())
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => dispatch(updateAllProducts(data)))
    .catch(() => dispatch(fetchProductsError()))
}, [])
```

🧠 **Drawbacks**:

* API logic is tightly coupled with UI
* Hard to reuse or test
* Repetition if multiple components need the same call

---

## 🔸 Stage 2: Dispatching API Actions with a Custom Middleware

You introduced a **generic action structure** and moved fetch logic into a middleware:

```js
dispatch({
  type: "api/makeCall",
  payload: {
    url: "products",
    onStart: fetchProducts.type,
    onSuccess: updateAllProducts.type,
    onError: fetchProductsError.type,
  },
})
```

🔁 The middleware intercepts this action and performs the fetch.

### 🔌 Middleware: `apiMiddleware.js`

```js
export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type !== "api/makeCall") return next(action)

  const { url, onStart, onSuccess, onError } = action.payload
  dispatch({ type: onStart })

  fetch(`https://fakestoreapi.com/${url}`)
    .then(res => res.json())
    .then(data => dispatch({ type: onSuccess, payload: data }))
    .catch(() => dispatch({ type: onError }))
}
```

✅ **Benefits**:

* Centralized API logic
* Dispatch flow becomes declarative
* Reusable across components

---

## 🚀 Stage 3: Abstracting API Call Dispatch with `fetchData()` Helper

Finally, to make dispatching cleaner, you wrapped the custom action object in a function:

```js
export const fetchData = (payload) => ({
  type: "api/makeCall",
  payload,
})
```

Now your `Header` component becomes elegant:

```js
dispatch(fetchData({
  url: "products",
  onStart: fetchProducts.type,
  onSuccess: updateAllProducts.type,
  onError: fetchProductsError.type,
}))
```

📦 This abstracts the `type` boilerplate and makes the API calls easy to configure.

---

## ⚙️ `apiMiddleware`: How It Works

Let’s break it down:

```js
if (action.type === "api/makeCall") {
  const { url, onStart, onSuccess, onError } = action.payload

  dispatch({ type: onStart }) // Step 1: Set loading
  fetch(BASE_URL + '/' + url)
    .then(res => res.json())
    .then(data => dispatch({ type: onSuccess, payload: data })) // Step 2: Send data
    .catch(() => dispatch({ type: onError })) // Step 3: Error fallback
}
```

📌 It acts like a **mini API engine** controlled by dispatch.

---

## ✅ Benefits of This Evolution

| Feature                | Stage 1       | Stage 2                        | Stage 3                       |
| ---------------------- | ------------- | ------------------------------ | ----------------------------- |
| API in `useEffect`     | ✅ Yes         | ❌ No                           | ❌ No                          |
| Middleware abstraction | ❌ No          | ✅ Yes                          | ✅ Yes                         |
| Dispatch complexity    | 🛠️ Manual    | 🔁 Structured                  | ⚡ Simplified with `fetchData` |
| Reusability            | ❌ Very low    | 🔄 Good                        | 🔄 Great                      |
| Separation of concerns | ❌ Mixed logic | ✅ Clean                        | ✅ Cleaner                     |
| Testability            | ❌ Poor        | ✅ Middleware tested separately | ✅ Same                        |

---

## 🔚 Final Notes

> You've taken your Redux project from:
>
> * **Messy `useEffect` fetch calls**
> * To **action-driven declarative API logic**
> * To **fully reusable middleware-based architecture**

🎉 This is exactly how scalable Redux apps are built!

