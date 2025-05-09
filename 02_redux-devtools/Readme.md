
### 📘 **Redux Counter Example with Action Types**

This project demonstrates a basic **Redux** setup with a counter logic implemented in plain JavaScript (no React). It includes different action types to manipulate the post count value and demonstrates how to manually connect Redux state to DOM updates.

---

## 📂 Table of Contents

1. [Redux Overview](#redux-overview)
2. [Initial Setup](#initial-setup)
3. [Defining Action Types](#defining-action-types)
4. [Creating the Reducer](#creating-the-reducer)
5. [Creating the Store](#creating-the-store)
6. [Subscribing to the Store](#subscribing-to-the-store)
7. [Dispatching Actions](#dispatching-actions)
8. [DOM Integration](#dom-integration)
9. [Full Code](#full-code)
10. [Takeaways](#takeaways)

---

## 📌 Redux Overview

Redux is a **state management library** that maintains the application state in a **single JavaScript object (store)**. It revolves around three core principles:

* **Single source of truth** – State is stored in one place (store).
* **State is read-only** – The only way to change state is to dispatch actions.
* **Changes are made with pure functions** – Reducers handle how state changes.

---

## ⚙️ Initial Setup

Start by defining your **initial state**. This is the default state your reducer will use before any actions are dispatched.

```js
const initialState = {
  post: 0,
  name: 'Anurag Singh',
  age: 26,
}
```

---

## 🎯 Defining Action Types

Create constants for action types. This helps avoid typos and makes action handling easier to manage:

```js
const INCREMENT = 'post/increment'
const DECREMENT = 'post/decrement'
const INCREASE_BY = 'post/increaseBy'
const DECREASE_BY = 'post/decreaseBy'
```

---

## 🧠 Creating the Reducer

The reducer is a pure function that takes the current state and an action, and returns a new state based on the action type.

```js
function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, post: state.post + 1 }
    case DECREMENT:
      return { ...state, post: state.post - 1 }
    case INCREASE_BY:
      return { ...state, post: state.post + action.payload }
    case DECREASE_BY:
      return { ...state, post: state.post - action.payload }
    default:
      return state
  }
}
```

---

## 🏗️ Creating the Store

Use `createStore` from Redux to create the store and pass the reducer. Optionally, connect to Redux DevTools.

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.())
```

---

## 📡 Subscribing to the Store

Use `store.subscribe()` to listen for state updates and reflect them in the DOM.

```js
store.subscribe(() => {
  postCountElement.innerText = store.getState().post
})
```

---

## 📤 Dispatching Actions

Actions are dispatched using `store.dispatch()`. Each dispatch triggers the reducer and updates the state.

```js
store.dispatch({ type: INCREMENT })
store.dispatch({ type: DECREMENT })
store.dispatch({ type: INCREASE_BY, payload: 15 })
store.dispatch({ type: DECREASE_BY, payload: 5 })
```

---

## 🧩 DOM Integration

Connect your Redux state to a DOM element and add interaction:

```js
postCountElement.addEventListener('click', () => {
  store.dispatch({ type: INCREMENT })
})
```

---

## 📜 Full Code

```js
import { createStore } from 'redux'

const postCountElement = document.querySelector('.post-count')

const initialState = {
  post: 0,
  name: 'Anurag Singh',
  age: 26,
}

const INCREMENT = 'post/increment'
const DECREMENT = 'post/decrement'
const INCREASE_BY = 'post/increaseBy'
const DECREASE_BY = 'post/decreaseBy'

function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, post: state.post + 1 }
    case DECREMENT:
      return { ...state, post: state.post - 1 }
    case INCREASE_BY:
      return { ...state, post: state.post + action.payload }
    case DECREASE_BY:
      return { ...state, post: state.post - action.payload }
    default:
      return state
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.())

postCountElement.innerText = store.getState().post

store.subscribe(() => {
  postCountElement.innerText = store.getState().post
})

store.dispatch({ type: INCREMENT })
store.dispatch({ type: DECREMENT })
store.dispatch({ type: INCREASE_BY, payload: 15 })
store.dispatch({ type: DECREASE_BY, payload: 5 })

postCountElement.addEventListener('click', () => {
  store.dispatch({ type: INCREMENT })
})
```

---

## 📘 Takeaways

* Redux can be used with or without React.
* Always define action types as constants.
* Reducers must be pure and should never mutate the state directly.
* Subscribing to the store allows syncing the UI with state changes.
* You can use `window.__REDUX_DEVTOOLS_EXTENSION__?.()` to debug via Chrome DevTools.

