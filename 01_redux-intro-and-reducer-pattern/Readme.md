## 🧠 Understanding Mutation vs. Non-Mutation in JavaScript (State Handling)

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

➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖ ➖➖➖


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





<hr style="height: 4px; background-color: white; border: none;" />

## 🧠 Redux State Management — Core Concept Breakdown

### 📦 Initial Setup
Redux revolves around **a single source of truth** — the **store**, which holds the entire application state.

```js
let reduxState = {
	count: 0,
	name: "Anurag Singh",
	age: 26,
};
```

This `reduxState` object acts as our **global state**, similar to what you'd find in a real Redux store.

---

### 🔁 The Reducer Function

A reducer is a **pure function** that determines how the state should change in response to an action.

```js
function reducer(state, action) {
    switch (action.type) {
        case "post/increment":
            return { ...state, count: state.count + 1 };
		case "post/decrement":
            return { ...state, count: state.count - 1 };
		case "post/incrementBy":
            return { ...state, count: state.count + action.payload };
		case "post/decrementBy":
            return { ...state, count: state.count - action.payload };
		default:
            return state;
	}
}
```

📝 **Key Notes**:
- Always return a **new object**, not a mutated one. (`{ ...state, ... }`)
- `switch-case` checks the `action.type` and updates state accordingly.
- `action.payload` is used for custom values (like `+10`, `-5`, etc.).
- The reducer must be **pure**: No side-effects, no API calls, just return the updated state.

---

### 🛠 Example State Transitions

```js
reduxState = reducer(reduxState, { type: "post/increment" });
reduxState = reducer(reduxState, { type: "post/increment" });
reduxState = reducer(reduxState, { type: "post/decrement" });
reduxState = reducer(reduxState, { type: "post/decrement" });
reduxState = reducer(reduxState, { type: "post/incrementBy", payload: 10 });

console.log("reduxState", reduxState); // Output: { count: 10, name: ..., age: ... }
```

### 📌 Action Format
An action is a plain JavaScript object with the following structure:

```js
{
    type: "post/incrementBy", // Required
  payload: 10               // Optional (used only in some cases)
}
```

---

### 📖 Redux Concepts Recap

| Concept               | Description |
|------------------------|-------------|
| **State**              | The centralized global data object |
| **Action**             | An object describing what happened |
| **Reducer**            | A pure function to update state based on action |
| **Dispatch** (manual here) | The act of triggering a state change using an action |
| **Immutability**       | Always return a new object instead of mutating the old state |
| **Pure Function**      | No side effects; output depends only on input |

---

### ✅ Final Thoughts

- This is how Redux works under the hood — actions + reducer = new state.
- In real Redux apps, you use:
  - `createStore()` to manage this state.
  - `dispatch()` to send actions.
  - `useSelector()` and `useDispatch()` in React for integration.
- Redux Toolkit simplifies this process with slices and immutable update utilities like `Immer`.


<hr style="height: 4px; background-color: white; border: none;" />

## 🧠 Full Redux Implementation Walkthrough (Vanilla JS)

This example shows how to **fully implement Redux** without React — purely in **Vanilla JavaScript** — to understand the Redux flow clearly.

---

### 📦 Initial Setup — `initialState`

```js
const initialState = {
	count: 0,
	name: "Anurag Singh",
	age: 26,
};
```

Your Redux state always starts with an **initial state**, representing the default UI data.

---

### 🏷️ Action Types (Constants)

```js
const increment = "post/increment";
const decrement = "post/decrement";
const incrementBy = "post/incrementBy";
const decrementBy = "post/decrementBy";
```

📌 Use constants for action types to avoid typos and maintain consistency across files.

---

### 🔁 Reducer — Heart of Redux

```js
function reducer(state = initialState, action) {
	switch (action.type) {
		case increment:
			return { ...state, count: state.count + 1 };
		case decrement:
			return { ...state, count: state.count - 1 };
		case incrementBy:
			return { ...state, count: state.count + action.payload };
		case decrementBy:
			return { ...state, count: state.count - action.payload };
		default:
			return state;
	}
}
```

📌 **Reducer Rules**:
- Always return **new state** (never mutate original).
- Must be a **pure function** (no side-effects).
- First arg: `state`, Second arg: `action`.

---

### 🏪 Create Store

```js
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());
```

- `createStore()` initializes the Redux store with the reducer.
- The optional `Redux DevTools` extension allows debugging in the browser.

---

### 📣 Subscribe to Store Updates

```js
const unsubscribe = store.subscribe(() => {
	console.log("getState()", store.getState());
	postCountElement.innerText = store.getState().count;
});
```

Whenever the state changes, this callback will run. You can update the UI here.

- `store.subscribe()` registers a listener.
- `unsubscribe()` can later remove this listener.

---

### 🚀 Dispatching Actions

#### dispatch is a function that you use to send an action to the reducer.

```js
store.dispatch({ type: increment });
store.dispatch({ type: decrement });
store.dispatch({ type: incrementBy, payload: 15 });
store.dispatch({ type: decrementBy, payload: 5 });
```

- Actions are plain JS objects.
- **`type`** is required.
- **`payload`** is optional (for passing data).
- This triggers the reducer, which returns the next state.

---

### 🖱️ Hooking into the UI

```js
postCountElement.addEventListener("click", () => {
	store.dispatch({ type: increment });
});
```

Clicking the DOM element triggers a Redux action — this simulates interactivity and shows real-time updates to state.

---

### 🧼 Unsubscribing

```js
unsubscribe(); 
```

This stops listening to state updates (used to clean up memory, similar to removing event listeners).

---

### 🔍 DevTools Snapshot

You can inspect state changes and action history if you have the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) browser extension installed. The line:

```js
window.__REDUX_DEVTOOLS_EXTENSION__?.()
```

enables that.

---

### ✅ Final Output in Console

```plaintext
getState() → count: 1
getState() → count: 0
getState() → count: 15
getState() → count: 10
getState() → count: 15
```

You can clearly track how the state updates after every dispatch.

---

### 🧠 Summary (Redux Flow)

1. **Initial State** defines default values.
2. **Reducer** returns new state based on action type.
3. **Store** is created using `createStore(reducer)`.
4. **Actions** are dispatched to update the state.
5. **Subscribe** listens to changes and can trigger UI updates.
