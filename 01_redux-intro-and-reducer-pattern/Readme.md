## 📘 Redux Counter Example with Action Types

This project demonstrates a basic **Redux** setup with a counter logic implemented in plain JavaScript (no React). It includes action types to manipulate the post count value and explains concepts like mutation, pure functions, reducers, and Redux state management step-by-step with practical examples.

---

## 📂 Table of Contents

1. [Mutation vs. Non-Mutation](#mutation-vs-non-mutation)
2. [Pure Functions](#pure-functions)
3. [Redux Basics](#redux-basics)
4. [Reducer Design](#reducer-design)
5. [Actions and Dispatch](#actions-and-dispatch)
6. [Redux in Vanilla JS (Full Example)](#redux-in-vanilla-js)
7. [Final Redux Flow Summary](#final-redux-flow-summary)

---

## 🔄 Mutation vs. Non-Mutation

## 📘 Redux Counter Example with Action Types

This project demonstrates a basic **Redux** setup with a counter logic implemented in plain JavaScript (no React). It includes action types to manipulate the post count value and explains concepts like mutation, pure functions, reducers, and Redux state management step-by-step with practical examples.

---

## 📂 Table of Contents

1. [Mutation vs. Non-Mutation](#mutation-vs-non-mutation)
2. [Pure Functions](#pure-functions)
3. [Redux Basics](#redux-basics)
4. [Reducer Design](#reducer-design)
5. [Actions and Dispatch](#actions-and-dispatch)
6. [Redux in Vanilla JS (Full Example)](#redux-in-vanilla-js)
7. [Final Redux Flow Summary](#final-redux-flow-summary)

---

## 🔄 Mutation vs. Non-Mutation

### 📌 Context
Let's say we have a simple object `state`:

```js
let state = {
	count: 0,
	name: "Anurag Singh",
	age: 26,
};

let prevState = state;
```

Here, `prevState` is **not a copy** of `state`—it's a **reference** to the same object in memory. That means **changing `state` will also reflect in `prevState`**, unless we explicitly create a new object.

---

### 🔁 Example of **Mutation** (Directly Changing the Original Object)

```js
state.count = state.count + 1;
```

- This **modifies** the `count` field **in-place**.
- Since `prevState` points to the **same object**, the update reflects in both `state` and `prevState`.
- This is called **mutating the state**.
- ⚠️ This can lead to **unintended side effects** in apps like React, where changes may not trigger re-renders.

---

### 🧪 Example of **Non-Mutation** (Immutable Update)

```js
state = { ...state, count: state.count + 1 };
```

- This creates a **new object** by copying the old state and changing the `count` field.
- `state` now points to a **new object** with updated data.
- `prevState` still points to the original object.
- ✅ This is the **preferred approach** in frameworks like **React/Redux** because it:
  - Makes state **predictable**.
  - Enables **change detection** using shallow equality (`prevState !== state`).
  - Prevents **accidental side-effects**.

---

### 🔬 Output Analysis

If we use the mutating version:
```js
state.count = state.count + 1;

console.log("prevState", prevState); // count: 1
console.log("state", state);         // count: 1
console.log(prevState === state);    // true ✅ (same object)
```

If we use the non-mutating version:
```js
state = { ...state, count: state.count + 1 };

console.log("prevState", prevState); // count: 0
console.log("state", state);         // count: 1
console.log(prevState === state);    // false ❌ (different object)
```

---

### 🔖 Summary (TL;DR)

| Concept              | Mutation                                   | Non-Mutation                               |
|----------------------|--------------------------------------------|---------------------------------------------|
| What changes?        | Original object is modified                | New object is created                       |
| `prevState === state`| `true`                                     | `false`                                     |
| React behavior       | May not re-render                          | Triggers re-render (in React)               |
| Preferred in React?  | ❌ No                                       | ✅ Yes                                       |
| Use case             | Quick update, okay for local-only data     | Global/shared state, React, Redux, etc.     |

---

### ✅ Pro Tip

In **functional programming** and **React state management**, always prefer **non-mutating updates** unless you're absolutely sure about side effects. Use tools like:
- `Object.assign({}, obj)` or `{ ...obj }` for shallow copies
- Libraries like **Immer** for deep updates


---

### 🧠 **Pure Function — Simple Explanation**

A **pure function** is a function that:

1. **Always gives the same output for the same input** — no matter how many times you call it.
2. **Doesn’t change anything outside itself** (no modifying global variables, DOM, localStorage, etc.).

---

### ✅ Example of a Pure Function

```js
function add(a, b) {
  return a + b;
}

add(2, 3); // Always returns 5
```

* ✅ Same input → same output
* ✅ Doesn’t touch anything else in the program

---

### ❌ Not a Pure Function (Impure Example)

```js
let count = 0;

function addToCount(x) {
  count += x;
  return count;
}
```

* ❌ It modifies a variable **outside** the function (`count`)
* ❌ Same input can give **different output**

---

### 🧩 Now, back to your `reducer(state, action)`

```js
function reducer(state, action) {
  switch (action.type) {
    case "post/increment":
      return { ...state, count: state.count + 1 };
    // ...
  }
}
```

* ✅ It does **not modify** the original `state`, but **returns a new object**
* ✅ It only uses its **inputs (`state` and `action`)** to decide what to return
* ✅ No external variables touched

👉 That’s why **reducers are pure functions**.

---

### 🎯 TL;DR — One-liner

> A **pure function** in JavaScript is a function that always returns the same result for the same inputs **and** does not cause any side effects.

---

## 📦 Redux Basics

Redux is a **state container** used to manage global application state. It enforces strict unidirectional data flow.

### Key Concepts:

* **State**: Single source of truth.
* **Action**: What happened.
* **Reducer**: How state changes.
* **Store**: Where everything lives.

### Example Initial State:

```js
const reduxState = {
  count: 0,
  name: "Anurag Singh",
  age: 26
};
```

### Action Format:

```js
{
  type: "INCREMENT_BY",
  payload: 5
}
```

* `type`: a string to describe the action
* `payload`: optional data to pass

---

## 🔁 Reducer Design

The reducer is a pure function responsible for returning new state based on the current state and the action dispatched.

```js
function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "INCREMENT_BY":
      return { ...state, count: state.count + action.payload };
    case "DECREMENT_BY":
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
}
```

### Detailed Walkthrough:

```js
const currentState = { count: 5 };
const action = { type: "INCREMENT_BY", payload: 3 };
const newState = reducer(currentState, action);
console.log(newState); // { count: 8 }
```

✅ No mutation: `currentState` is still `{ count: 5 }`

---

## 🚀 Actions and Dispatch

Actions describe an intention to change the state.

### Action Types:

```js
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const INCREMENT_BY = "INCREMENT_BY";
const DECREMENT_BY = "DECREMENT_BY";
```

### Dispatching Actions:

```js
store.dispatch({ type: INCREMENT });
store.dispatch({ type: INCREMENT_BY, payload: 10 });
```

🛠 `dispatch()` sends the action to the reducer → reducer returns new state → store updates → UI re-renders (if subscribed).

---

## 🧠 Redux in Vanilla JS

### Step 1: Initial State

```js
const initialState = {
  count: 0,
  name: "Anurag Singh",
  age: 26
};
```

### Step 2: Reducer Function

(As shown in the Reducer Design section)

### Step 3: Create Store

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());
```

* Uses Redux DevTools for debugging

### Step 4: Subscribe to Store

```js
store.subscribe(() => {
  const state = store.getState();
  postCountElement.innerText = state.count;
});
```

* Syncs Redux state with DOM

### Step 5: Dispatch Actions

```js
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT_BY", payload: 15 });
```

### Step 6: UI Interaction

```js
postCountElement.addEventListener("click", () => {
  store.dispatch({ type: "INCREMENT" });
});
```

### DevTools:

```js
window.__REDUX_DEVTOOLS_EXTENSION__?.()
```

Track every dispatched action, view the previous and current state, and time travel through state history.

---

## ✅ Final Redux Flow Summary

Redux follows this strict and traceable lifecycle:

### Flow:

1. **User interacts** with the UI
2. An **action** is dispatched
3. The **reducer** calculates the new state
4. The **store** is updated
5. **Subscribed UI** components re-render

### Practical Snapshot:

```js
// Initial state
{ count: 0 }

// After store.dispatch({ type: "INCREMENT" })
{ count: 1 }

// After store.dispatch({ type: "INCREMENT_BY", payload: 4 })
{ count: 5 }
```

> 🎯 Redux ensures state updates are explicit, traceable, and centralized.

---

Next Steps: Integrate Redux with React using `useDispatch`, `useSelector`, or migrate this example to Redux Toolkit for cleaner boilerplate.


### Real-life Analogy:

Editing the original document vs making a duplicate before editing. Redux expects the latter.

---

## 🧠 Pure Functions

### What is a Pure Function?

A pure function:

* Depends only on its inputs.
* Produces no side effects.
* Returns the same output for the same input.

### ✅ Pure Example:

```js
function multiply(a, b) {
  return a * b;
}
```

* Same inputs → same result.
* No external state used.

### ❌ Impure Example:

```js
let total = 10;
function addToTotal(x) {
  total += x;
  return total;
}
```

🔴 This modifies outer state, making it unpredictable.

### Pure Reducers in Redux:

```js
function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1 };
    default: return state;
  }
}
```

✅ No side effects. Uses inputs only. Predictable output.

---

## 📦 Redux Basics

Redux is a **state container** used to manage global application state. It enforces strict unidirectional data flow.

### Key Concepts:

* **State**: Single source of truth.
* **Action**: What happened.
* **Reducer**: How state changes.
* **Store**: Where everything lives.

### Example Initial State:

```js
const reduxState = {
  count: 0,
  name: "Anurag Singh",
  age: 26
};
```

### Action Format:

```js
{
  type: "INCREMENT_BY",
  payload: 5
}
```

* `type`: a string to describe the action
* `payload`: optional data to pass

---

## 🔁 Reducer Design

The reducer is a pure function responsible for returning new state based on the current state and the action dispatched.

```js
function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "INCREMENT_BY":
      return { ...state, count: state.count + action.payload };
    case "DECREMENT_BY":
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
}
```

### Detailed Walkthrough:

```js
const currentState = { count: 5 };
const action = { type: "INCREMENT_BY", payload: 3 };
const newState = reducer(currentState, action);
console.log(newState); // { count: 8 }
```

✅ No mutation: `currentState` is still `{ count: 5 }`

---

## 🚀 Actions and Dispatch

Actions describe an intention to change the state.

### Action Types:

```js
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const INCREMENT_BY = "INCREMENT_BY";
const DECREMENT_BY = "DECREMENT_BY";
```

### Dispatching Actions:

```js
store.dispatch({ type: INCREMENT });
store.dispatch({ type: INCREMENT_BY, payload: 10 });
```

🛠 `dispatch()` sends the action to the reducer → reducer returns new state → store updates → UI re-renders (if subscribed).

---

## 🧠 Redux in Vanilla JS

### Step 1: Initial State

```js
const initialState = {
  count: 0,
  name: "Anurag Singh",
  age: 26
};
```

### Step 2: Reducer Function

(As shown in the Reducer Design section)

### Step 3: Create Store

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());
```

* Uses Redux DevTools for debugging

### Step 4: Subscribe to Store

```js
store.subscribe(() => {
  const state = store.getState();
  postCountElement.innerText = state.count;
});
```

* Syncs Redux state with DOM

### Step 5: Dispatch Actions

```js
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT_BY", payload: 15 });
```

### Step 6: UI Interaction

```js
postCountElement.addEventListener("click", () => {
  store.dispatch({ type: "INCREMENT" });
});
```

### DevTools:

```js
window.__REDUX_DEVTOOLS_EXTENSION__?.()
```

Track every dispatched action, view the previous and current state, and time travel through state history.

---

## ✅ Final Redux Flow Summary

Redux follows this strict and traceable lifecycle:

### Flow:

1. **User interacts** with the UI
2. An **action** is dispatched
3. The **reducer** calculates the new state
4. The **store** is updated
5. **Subscribed UI** components re-render

### Practical Snapshot:

```js
// Initial state
{ count: 0 }

// After store.dispatch({ type: "INCREMENT" })
{ count: 1 }

// After store.dispatch({ type: "INCREMENT_BY", payload: 4 })
{ count: 5 }
```

> 🎯 Redux ensures state updates are explicit, traceable, and centralized.

---

Next Steps: Integrate Redux with React using `useDispatch`, `useSelector`, or migrate this example to Redux Toolkit for cleaner boilerplate.
