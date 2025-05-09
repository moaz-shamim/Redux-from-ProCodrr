## 📘 Building a Custom Redux-like Store — Explained Step-by-Step

This project showcases how to **create your own Redux-like state management system** using a custom function `myCreateStore`. It replicates the core functionalities of Redux such as state handling, subscribing to changes, and dispatching actions.

---

## 📂 Table of Contents

1. [Project Overview](#project-overview)
2. [Initial State Setup](#initial-state-setup)
3. [Action Types](#action-types)
4. [Reducer Function](#reducer-function)
5. [Using createStore vs myCreateStore](#using-createstore-vs-mycreatestore)
6. [Subscribing to Store Changes](#subscribing-to-store-changes)
7. [Dispatching Actions](#dispatching-actions)
8. [Unsubscribing](#unsubscribing)
9. [DOM Interaction](#dom-interaction)
10. [Summary](#summary)

---

## 🧠 Project Overview

You’ve implemented a Redux-like architecture in vanilla JavaScript using your own function `myCreateStore`, and compared it side-by-side with Redux’s built-in `createStore`.

The project includes:

* Defining initial state and reducer
* Creating a store
* Subscribing to state updates
* Dispatching actions
* Updating DOM based on state

---

## 🏁 Initial State Setup

This is the default state used to initialize your custom store:

```js
const initialState = {
  post: 0,
  name: 'Anurag Singh',
  age: 26,
}
```

Each property represents a piece of your global state.

---

## 🏷️ Action Types

These constants represent the different types of state transitions your reducer can handle:

```js
const INCREMENT = 'post/increment'
const DECREMENT = 'post/decrement'
const INCREASE_BY = 'post/increaseBy'
const DECREASE_BY = 'post/decreaseBy'
```

This keeps action type strings consistent and reduces typos.

---

## 🔁 Reducer Function

The reducer defines **how your state updates** based on actions:

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

✅ Pure function
✅ No side effects
✅ Handles dynamic updates via `payload`

---

## 🏗️ Using createStore vs myCreateStore

### Redux Version:

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.())
```

### Custom Version:

```js
const myStore = myCreateStore(reducer)
```

Your `myCreateStore` likely implements these internal methods:

* `getState()`
* `dispatch(action)`
* `subscribe(listener)`

🔄 It should maintain the current state, update it via reducer on `dispatch`, and notify all subscribers on change.

---

## 📣 Subscribing to Store Changes

You’ve added three subscribers:

```js
const unsubscribe1 = myStore.subscribe(() => {
  console.log(myStore.getState())
  postCountElement.innerText = myStore.getState().post
})

const unsubscribe2 = myStore.subscribe(() => console.log('hii'))
const unsubscribe3 = myStore.subscribe(() => console.log('hello'))
```

✅ Each subscriber will be called after any dispatch.

---

## 🚀 Dispatching Actions

You’re dispatching four actions:

```js
myStore.dispatch({ type: INCREMENT })
myStore.dispatch({ type: DECREMENT })
myStore.dispatch({ type: INCREASE_BY, payload: 15 })
myStore.dispatch({ type: DECREASE_BY, payload: 5 })
```

🧠 This triggers your reducer to calculate new state → all subscribed functions are executed.

---

## ❌ Unsubscribing

You unsubscribe some listeners after the first dispatch:

```js
unsubscribe2()
unsubscribe3()
```

Only `unsubscribe1` remains active.

✅ This ensures you're not calling unnecessary listeners anymore.

---

## 🖱️ DOM Interaction

Initial rendering:

```js
postCountElement.innerText = myStore.getState().post
```

Click event to trigger update:

```js
postCountElement.addEventListener('click', () => {
  myStore.dispatch({ type: INCREMENT })
})
```

This means every click increments the `post` count and updates the UI.

---

## ✅ Summary

| Concept         | Description                               |
| --------------- | ----------------------------------------- |
| `myCreateStore` | Custom Redux-like implementation          |
| `getState()`    | Returns current state                     |
| `dispatch()`    | Sends action to reducer and updates state |
| `subscribe()`   | Adds a listener to state changes          |
| `unsubscribe()` | Removes a listener                        |

🎯 You now understand how Redux works under the hood by building your own version.

> 🧩 This forms the foundation for building custom state libraries, learning how React/Redux internals behave, and deepening your understanding of state management.
