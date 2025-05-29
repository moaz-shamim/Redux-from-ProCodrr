# ⚙️ Redux Toolkit: Transitioning to `createAsyncThunk` & `extraReducers`

> This guide explains how you evolved your API logic from manual thunk-based calls to the clean and declarative `createAsyncThunk` pattern using `extraReducers`.

---

## 📚 Table of Contents

1. [🎯 Why the Transition?](#-why-the-transition)
2. [🔹 Stage 1: Manual Redux Thunk for API Calls](#-stage-1-manual-redux-thunk-for-api-calls)
3. [🔸 Stage 2: Creating `createAsyncThunk`](#-stage-2-creating-createasyncthunk)
4. [🧱 Stage 3: Handling Async States with `extraReducers`](#-stage-3-handling-async-states-with-extrareducers)
5. [📊 Final Refactored Slice with `createAsyncThunk`](#-final-refactored-slice-with-createasyncthunk)
6. [✅ Summary Table](#-summary-table)
7. [📌 Conclusion](#-conclusion)

---

## 🎯 Why the Transition?

Initially, you used custom thunk functions to handle API calls. While that worked fine, it:

* 🔁 Repeated loading/error logic
* 🧩 Mixed concerns in reducer vs thunk
* 📦 Didn't scale well for multiple async calls

So, you switched to:

* `createAsyncThunk` to define async logic
* `extraReducers` to handle the result cleanly in slice

✅ A much cleaner and scalable approach!

---

## 🔹 Stage 1: Manual Redux Thunk for API Calls

### 👇 What You Did

```js
export const fetchCartItemsData = () => (dispatch) => {
  dispatch(fetchCartItems()); // set loading true
  fetch(`https://fakestoreapi.com/carts/5`)
    .then((res) => res.json())
    .then((data) => dispatch(loadCartItems(data)))
    .catch(() => dispatch(fetchCartItemsError()));
};
```

You also had extra reducer logic like:

```js
fetchCartItems(state) {
  state.loading = true;
}
loadCartItems(state, action) {
  state.list = action.payload.products;
  state.loading = false;
}
```

📌 **Issues**:

* Required 3 action types per API (`start`, `success`, `error`)
* Logic was spread across slice and thunk

---

## 🔸 Stage 2: Creating `createAsyncThunk`

You replaced your thunk with this one-liner:

```js
export const fetchCartItemsData = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const res = await fetch("https://fakestoreapi.com/carts/5");
    return res.json();
  }
);
```

🔍 This automatically creates:

* `cart/fetchCartItems/pending`
* `cart/fetchCartItems/fulfilled`
* `cart/fetchCartItems/rejected`

➡️ No need to manually define those action creators anymore.

---

## 🧱 Stage 3: Handling Async States with `extraReducers`

You then used `extraReducers` instead of `reducers`:

```js
extraReducers: (builder) => {
  builder
    .addCase(fetchCartItemsData.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchCartItemsData.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload.products;
    })
    .addCase(fetchCartItemsData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went Wrong.";
    });
}
```

✅ Now your slice is fully clean:

* No duplicated loading/error logic
* No need to dispatch multiple actions
* Pure and clean API state management

---

## 🧱 1. **Why `extraReducers` + `builder.addCase`?**

When you use `createAsyncThunk`, Redux Toolkit automatically creates **three action types** for you:

* `fetchCartItemsData.pending`
* `fetchCartItemsData.fulfilled`
* `fetchCartItemsData.rejected`

These are **not part of your normal slice reducers**, so to handle them, you must use `extraReducers`.

### 🔧 `extraReducers` lets you handle *external actions* — like those created by `createAsyncThunk`.

```js
extraReducers: (builder) => {
	builder
		.addCase(fetchCartItemsData.pending, (state) => {
			state.loading = true;
		})
		.addCase(fetchCartItemsData.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload.products;
		})
		.addCase(fetchCartItemsData.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload || "Something went wrong.";
		});
}
```

So `builder.addCase` is just a nice, chainable way to respond to those lifecycle actions.

---

## 🚫 2. Can You Fetch Data Without `extraReducers`?

Yes — you can **still use `dispatch()` with a normal async thunk** (the old-school way), like this:

```js
export const fetchCartItemsData = () => async (dispatch) => {
	dispatch(fetchCartItems()); // manual action
	try {
		const res = await fetch("https://fakestoreapi.com/carts/5");
		const data = await res.json();
		dispatch(loadCartItems(data)); // manual action
	} catch (error) {
		dispatch(fetchCartItemsError(error.message));
	}
};
```

Then in your `reducers`, you manually create those reducers:

```js
reducers: {
	fetchCartItems(state) {
		state.loading = true;
	},
	loadCartItems(state, action) {
		state.loading = false;
		state.list = action.payload.products;
	},
	fetchCartItemsError(state, action) {
		state.loading = false;
		state.error = action.payload || "Something went wrong.";
	},
}
```

✅ **This works**, but it requires more boilerplate:

* You have to define all three action creators
* You have to handle dispatch manually
* You lose out on auto-generated lifecycle handling

---

## ✅ 3. Why Use `createAsyncThunk` + `extraReducers`?

It’s **cleaner**, more **standard**, and follows Redux Toolkit best practices:

| Traditional Thunk Way     | `createAsyncThunk` Way           |
| ------------------------- | -------------------------------- |
| Manual action creators    | Auto-generated lifecycle actions |
| More boilerplate          | Cleaner, fewer lines of code     |
| Custom dispatching needed | Just call `dispatch(thunkFn())`  |

---

## 🧠 Final Summary

| Concept                 | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `createAsyncThunk`      | Creates async action + lifecycle actions                                 |
| `extraReducers`         | Lets your slice respond to external actions                              |
| `builder.addCase`       | Lets you handle each action (`pending`, `fulfilled`, `rejected`) cleanly |
| Can you do it manually? | Yes, but it’s more work and less clean                                   |

---

Would you like a small visual of this flow or side-by-side comparison?

---

## 📊 Final Refactored Slice with `createAsyncThunk`

```js
export const fetchCartItemsData = createAsyncThunk("cart/fetchCartItems", async () => {
  const response = await fetch("https://fakestoreapi.com/carts/5");
  return response.json();
});

const slice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    list: [],
    error: "",
  },
  reducers: {
    addCartItem(state, action) {
      // simplified logic
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItemsData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
      })
      .addCase(fetchCartItemsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went Wrong.";
      });
  }
});
```

---

## ✅ Summary Table

| Feature                | Manual Thunk Approach | `createAsyncThunk` Approach                   |
| ---------------------- | --------------------- | --------------------------------------------- |
| Async Action Creators  | Manual (3 per API)    | Auto-generated (pending, fulfilled, rejected) |
| Reducer Setup          | Needs `reducers`      | Uses `extraReducers`                          |
| Loading/Error Handling | Manual                | Built-in and clean                            |
| Cleaner Logic          | ❌ More boilerplate    | ✅ Less code                                   |
| Recommended for Scale? | ❌ Not ideal           | ✅ Yes, production-ready                       |

---

## 📌 Conclusion

> You successfully transitioned from:
>
> **Manual async actions** → to **`createAsyncThunk` + `extraReducers`**
>
> 🔥 Now your API logic is scalable, cleaner, and idiomatic Redux Toolkit.



## 🧠 What Do We Pass to `extraReducers`?

There are **two ways** to use `extraReducers` in Redux Toolkit’s `createSlice()`:

---

### ✅ Option 1: The Builder Callback Form (✔️ Recommended)

```js
extraReducers: (builder) => {
  builder
    .addCase(fetchData.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}
```

🧩 **You pass a function that receives `builder`**
Then you use `.addCase()` on that builder to define what happens when each thunk lifecycle action occurs.

* `fetchData.pending` is dispatched automatically when the thunk starts
* `fetchData.fulfilled` is dispatched when the thunk succeeds
* `fetchData.rejected` is dispatched on error

✅ This is the modern and clean way to use `extraReducers`.

---

### 🛠 Option 2: The Object Map Form (less used)

You can also pass an object instead of a function:

```js
extraReducers: {
  [fetchData.pending]: (state) => {
    state.loading = true;
  },
  [fetchData.fulfilled]: (state, action) => {
    state.list = action.payload;
    state.loading = false;
  },
  [fetchData.rejected]: (state, action) => {
    state.error = action.error.message;
    state.loading = false;
  },
}
```

⚠️ This works fine, but it's less preferred now because:

* No TypeScript inference
* Less readable for complex logic

---

### 🧪 Recap: What You Pass Depends On Syntax

| Syntax Used      | What You Pass in `extraReducers`       | Example                               |
| ---------------- | -------------------------------------- | ------------------------------------- |
| ✅ Builder syntax | A function with `(builder) => {}`      | `extraReducers: (builder) => { ... }` |
| 🛠 Object syntax | A plain object with `[actionType]: fn` | `extraReducers: { [action]: fn }`     |

---

### ✅ Best Practice

Always prefer:

```js
extraReducers: (builder) => {
  builder
    .addCase(thunk.pending, ...)
    .addCase(thunk.fulfilled, ...)
    .addCase(thunk.rejected, ...)
}
```


## ❓ Can We Use `async/await` in Redux Outside of `createAsyncThunk`?

### ✅ Yes, you **can** use `async/await` outside of `createAsyncThunk`.

But the key is: **you still need middleware** to allow async functions in `dispatch()`.

---

### 🧠 Let’s Break It Down

Redux only understands **plain objects**:

```js
dispatch({ type: 'SOME_ACTION' }) ✅
dispatch(async () => {}) ❌ (unless middleware handles it)
```

---

### 💡 You Can Still Do This with `redux-thunk`

If you’re using Redux Toolkit or have added `redux-thunk`, you can write async functions like this:

```js
export const fetchUserData = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "user/fetchStart" });

    const res = await fetch(`/api/user/${userId}`);
    const data = await res.json();

    dispatch({ type: "user/fetchSuccess", payload: data });
  } catch (err) {
    dispatch({ type: "user/fetchError" });
  }
};
```

Then in your component:

```js
dispatch(fetchUserData(5)); // ✅ works because of redux-thunk
```

So yes — you’re **free to use `async/await` anywhere**, **as long as you dispatch a function** and use a middleware (like `redux-thunk` or your custom `func`) to handle it.

---

## 🆚 Why `createAsyncThunk` Then?

| Feature                | `async thunk (manual)`          | `createAsyncThunk`             |
| ---------------------- | ------------------------------- | ------------------------------ |
| Uses `async/await`     | ✅ Yes                           | ✅ Yes                          |
| Auto generates actions | ❌ No (you write all 3 manually) | ✅ pending, fulfilled, rejected |
| Cleaner setup          | ❌ Slightly verbose              | ✅ Concise & declarative        |
| Scales well            | ⚠️ Gets messy with many thunks  | ✅ Scales great                 |
| Custom logic           | ✅ Full control                  | ✅ Full control via `thunkAPI`  |

---

## ✅ Summary

> ✔️ You **can** use `async/await` in Redux **outside** of `createAsyncThunk`
> 🚨 But you **must** have middleware like `redux-thunk` or `func` to support dispatching async functions
> ✅ `createAsyncThunk` is just a **cleaner and more structured alternative**


