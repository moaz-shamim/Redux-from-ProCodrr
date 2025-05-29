# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




Absolutely! Let’s break this down nice and clean:

---

### 🧠 **Why Not Just `useEffect` for Fetching Data?**

Using `useEffect` + `fetch` or `axios` is *perfectly fine* for small-scale apps. But as your app grows, you start dealing with:

* Complex loading/error states
* Duplicate API logic scattered in components
* Re-fetching and caching manually
* Global state updates after fetch
* Managing stale data
* Handling polling, retries, pagination

That’s where **RTK Query** comes in and makes life easier.

---

### 🚀 **Benefits of RTK Query (Redux Toolkit Query)**

1. **🔥 Built-in Data Fetching + Caching**

   * Automatically caches data and reuses it across components
   * Prevents unnecessary network requests (uses cache when data is fresh)

2. **⛓️ Auto Refetch & Stale Data Handling**

   * You can configure when data should be refetched (on mount, focus, reconnect)

3. **🌀 Automatic Loading, Error, and Success State**

   * You get `isLoading`, `isError`, `data`, `isFetching`, etc., right out of the box

4. **🧹 Clean Separation of Concerns**

   * API logic is defined in one place (`createApi`), not inside components

5. **🧠 Code Reusability**

   * Once you define an endpoint, you can use it across any component easily

6. **🧩 Optimistic Updates**

   * Great for updating the UI before the server responds (e.g., instant UI feedback)

7. **📦 Automatic Cache Invalidation**

   * Handles cache invalidation after mutations like `add`, `update`, `delete` automatically using `providesTags` and `invalidatesTags`

8. **🌐 Supports Queries and Mutations**

   * Whether you’re fetching data (query) or posting/updating (mutation), it's well structured

9. **📡 Polling and WebSocket Support**

   * Built-in support for polling intervals to refetch data continuously

10. **🛠 Devtools Friendly**

    * Works seamlessly with Redux DevTools for better debugging and tracking

11. **🧪 Great for Testing**

    * Since data logic is isolated, you can mock it easily in tests

12. **📏 Typescript Support**

    * Auto-generates types when used with TypeScript and OpenAPI or GraphQL schemas

---

### ✅ **Use Cases Where RTK Query Shines**

* Medium to large apps with many API calls
* Apps with shared data across multiple components
* You need real-time data updates (polling/websocket)
* You want automatic cache and re-fetch logic
* You want to manage API state **in Redux** without writing boilerplate

---

### 🆚 In Summary: `useEffect` vs `RTK Query`

| Feature                    | `useEffect` + Axios/Fetch | RTK Query                  |
| -------------------------- | ------------------------- | -------------------------- |
| Data fetching              | Manual                    | Built-in                   |
| Loading/Error state        | Manual                    | Built-in                   |
| Caching                    | Manual (if any)           | Automatic                  |
| Global state management    | Manual (Redux or Context) | Integrated with Redux      |
| Code duplication           | High                      | Low (centralized API file) |
| Stale data management      | Manual                    | Automatic                  |
| Mutation handling          | Manual                    | Built-in                   |
| Pagination/Infinite scroll | Manual                    | Supported natively         |
| DevTools integration       | Limited                   | Excellent                  |

---

Would you like a code example comparing both approaches side-by-side?


Great, Moaz! You're using **RTK Query**, and you're trying to inspect what’s inside `useAddTaskMutation` and `useGetTasksQuery`.

Let me walk you through what these are and what you'll find if you log them.

---

### 🔍 `useGetTasksQuery` and `useAddTaskMutation`

These are **auto-generated React hooks** created by RTK Query when you define your API endpoints:

```js
export const { useGetTasksQuery, useAddTaskMutation } = api;
```

* `useGetTasksQuery` → used to **fetch** data (GET `/tasks`)
* `useAddTaskMutation` → used to **send data** (POST `/tasks`)

---

### 🧪 What happens if you log them?

```js
console.log("Dummy", useAddTaskMutation);
console.log("pummy", useGetTasksQuery);
```

This will log **the functions themselves**, not the results of using them.

You'll see something like this in the console:

```js
Dummy ƒ useAddTaskMutation() { ... }
pummy ƒ useGetTasksQuery() { ... }
```

They're not the **mutation result or query result**, just the **hook definitions**.

---

### ✅ To *see what’s inside* (the result), you need to **call the hook** inside a React component:

Example:

```jsx
import React from "react";
import { useGetTasksQuery, useAddTaskMutation } from "./api";

const TaskComponent = () => {
  const { data, error, isLoading } = useGetTasksQuery();
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();

  console.log("Fetched Tasks:", data);
  console.log("Fetch Error:", error);

  return (
    <div>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {data?.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
      <button
        onClick={() =>
          addTask({ title: "New Task", completed: false })
        }
        disabled={isAdding}
      >
        Add Task
      </button>
    </div>
  );
};
```

---

### 🎯 TL;DR

* `useAddTaskMutation` and `useGetTasksQuery` are **React hooks** (functions).
* Logging them will just show the function definitions.
* To inspect their result (like response data), **use them inside a component** and log the **return values** (e.g., `data`, `isLoading`, `error`).

---

Let me know if you'd like to see a working example in StackBlitz or CodeSandbox — happy to spin one up.


You're using `transformResponse` inside your RTK Query endpoint, which is a **powerful tool** to **modify the API response** *before* it hits your component. Let me break it down clearly so you understand **what it does**, **what it receives**, and **what you can inspect**.

---

### 🔧 What is `transformResponse`?

It's a function that lets you **modify the raw API response** *before it's returned* to your component.

```js
getTasks: builder.query({
  query: () => "/tasks",
  transformResponse: (tasks) => tasks.reverse(),
  providesTags: ["Tasks"]
})
```

---

### 🧠 What’s Inside `transformResponse`?

In your case, `transformResponse` receives the result of the API call to `GET /tasks`. Let's say your API returns this:

```json
[
  { "id": 1, "title": "Buy milk" },
  { "id": 2, "title": "Clean room" },
  { "id": 3, "title": "Study React" }
]
```

The `transformResponse` will receive that array as the `tasks` argument:

```js
transformResponse: (tasks) => {
  console.log("Raw tasks from API:", tasks);
  return tasks.reverse();
}
```

🔁 After this function runs, your component will receive the **reversed array**.

---

### ✅ Where to log and inspect it?

You can log the raw response **inside `transformResponse`**, like this:

```js
transformResponse: (tasks) => {
  console.log("Inside transformResponse:", tasks);
  return tasks.reverse();
}
```

If you open your browser's dev console while the data is fetched, you'll see the raw data logged before it's transformed.

---

### 📝 Final Note

* `transformResponse` only works on the **response body**.
* If your API returns a wrapped object like this:

```json
{ "status": "success", "data": [ ... ] }
```

Then you’d need to extract it:

```js
transformResponse: (response) => {
  console.log("API response:", response);
  return response.data.reverse();
}
```

---

Let me know if your API response is structured differently — I can show you how to adapt the `transformResponse` accordingly.


Great question! Let's break down what `providesTags` does in your RTK Query configuration:

---

### 🏷️ What is `providesTags`?

`providesTags` is a feature in **RTK Query** used to **automatically manage cache and invalidation** of data. It tells RTK Query:

> "This query provides data associated with a specific tag, so if any mutation invalidates this tag, re-fetch this data."

---

### 🧠 In Your Code:

```js
getTasks: builder.query({
  query: () => "/tasks",
  transformResponse: (tasks) => tasks.reverse(),
  providesTags: ["Tasks"]
}),
```

You're saying:
🔹 “The result of `getTasks` should be tagged as `'Tasks'`.”

This means that **whenever** any **mutation invalidates `'Tasks'`**, this query will **automatically re-fetch**.

---

### ✅ Why is that useful?

If you use this with a mutation like `addTask`, you can set:

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  invalidatesTags: ["Tasks"],
}),
```

Now what happens?

➡️ After a task is added, RTK Query sees that `addTask` **invalidates** the `"Tasks"` tag.
➡️ So it knows that `getTasks`, which **provides** the `"Tasks"` tag, should **re-fetch** its data.

---

### 📦 Think of it like this:

| Query / Mutation | Tags                         | Effect                            |
| ---------------- | ---------------------------- | --------------------------------- |
| `getTasks`       | `providesTags: ["Tasks"]`    | "I provide this data"             |
| `addTask`        | `invalidatesTags: ["Tasks"]` | "I changed this data, refetch it" |

---

### 💡 Bonus Tip:

You can also use dynamic tags, like:

```js
providesTags: (result, error, arg) =>
  result ? result.map(task => ({ type: "Tasks", id: task.id })) : [],
```

And then invalidate just one task by its ID.

---

### ✅ TL;DR

* `providesTags` tags your query data for smart caching.
* RTK Query can then re-fetch it when a mutation with `invalidatesTags` is triggered.
* This keeps your UI **in sync** with your backend automatically.

Let me know if you want to try dynamic tagging or need a visual flow!


Great question, Moaz! Understanding how to name tags properly in RTK Query is key to getting caching and re-fetching to work correctly. Let's break it down:

---

## 🧠 What is a “Tag” in RTK Query?

A **tag** is just a label that RTK Query uses to:

* Track **what data** a query provides (`providesTags`)
* Know **what data** should be refreshed when a mutation occurs (`invalidatesTags`)

Tags can be simple strings or structured objects.

---

## ✅ How to Decide the Tag Name

There is **no strict rule**, but here’s a good convention:

### 🧱 Structure:

You can define a tag as either:

* A **simple string**: `"Tasks"`, `"Users"`, etc.
* Or a **structured object**:

  ```js
  { type: "Tasks", id: 1 }
  ```

This allows **fine-grained control**.

---

### 🧩 Simple Example (Static Tag):

```js
providesTags: ["Tasks"]
```

* Use when you want to refetch **all** tasks if one is added, updated, or deleted.
* This is great for simple lists.

### 🧩 Structured Example (Dynamic Tags for Per-Item Caching):

```js
providesTags: (result) =>
  result
    ? result.map(task => ({ type: "Tasks", id: task.id }))
    : [];
```

Then you can invalidate just one:

```js
invalidatesTags: (result, error, id) => [{ type: "Tasks", id }]
```

---

## 🧰 Example Use Case: Tasks

### 🔸 `getTasks` (Query All Tasks):

```js
getTasks: builder.query({
  query: () => "/tasks",
  providesTags: ["Tasks"]
})
```

### 🔸 `addTask` (Mutation):

```js
addTask: builder.mutation({
  query: (newTask) => ({
    url: "/tasks",
    method: "POST",
    body: newTask,
  }),
  invalidatesTags: ["Tasks"] // So all tasks will refetch
})
```

---

## ✅ Best Practices for Naming

| Type of Tag | Format Example                     | When to Use                                    |
| ----------- | ---------------------------------- | ---------------------------------------------- |
| Collection  | `"Tasks"`                          | To refetch all items                           |
| Per-Entity  | `{ type: "Tasks", id }`            | To target specific items (update/delete by ID) |
| Nested      | `"UserPosts"` or custom structures | For complex nested data                        |

Just pick a **meaningful and consistent** name related to the data. There is **no magic string**, but it must match between `providesTags` and `invalidatesTags`.

---

## 🎯 TL;DR

* Tag names are **custom labels** for managing cache in RTK Query.
* You decide the tag name — just keep it meaningful and consistent.
* Use simple strings for **global cache** and structured tags for **granular control**.

---

Want to try converting your tasks API to use per-item tags with IDs? I can help you write that logic.


Great question, Moaz! Let's break this down **simply**:

---

### 🔍 What is this?

```js
const [addTask] = useAddTaskMutation();
```

This is using **React Hooks syntax**.

The `useAddTaskMutation()` hook comes from **RTK Query**, and it returns an array of helpers for the mutation.

---

### 🤔 Why do we write `[addTask]` like this?

Because `useAddTaskMutation()` returns an **array** with multiple items (like `useState` does).

Example:

```js
const [addTask, result] = useAddTaskMutation();
```

* `addTask` → is a function that **calls the API** (e.g., to add a task)
* `result` → gives you the **status** of that API call (like loading, success, error, data)

---

### ✅ Most Common Usage:

```js
const [addTask] = useAddTaskMutation();

const handleAdd = async () => {
  await addTask({ title: "New Task" });
};
```

You often only need the `addTask` function, so people write:

```js
const [addTask] = useAddTaskMutation();
```

But if you want to track response status:

```js
const [addTask, { isLoading, isSuccess, isError }] = useAddTaskMutation();
```

---

### 💡 Analogy (Like useState):

```js
const [count, setCount] = useState(0);          // [value, updater]
const [addTask, result] = useAddTaskMutation(); // [function, response]
```

---

### ✅ Summary:

You're writing:

```js
const [addTask] = useAddTaskMutation();
```

Because:

* `useAddTaskMutation()` returns an array
* You’re extracting only the `addTask` function
* It's **just like using hooks** with destructuring

Let me know if you want to try it live in a small example!


Yes, Moaz — I can explain what’s happening in this line:

```js
const [addTask] = useAddTaskMutation();
```

This line is part of **Redux Toolkit Query (RTK Query)**, specifically the **auto-generated hook** `useAddTaskMutation` created from your `createApi` definition.

---

### 🧠 What's actually happening?

When you write:

```js
const [addTask] = useAddTaskMutation();
```

You're **destructuring the result** of calling the `useAddTaskMutation()` hook.

Here’s a breakdown:

---

### 🧩 1. `useAddTaskMutation()` hook

This is a **custom hook** automatically generated by RTK Query based on the `addTask` endpoint you defined in your `api` slice:

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  invalidatesTags: ["Tasks"],
}),
```

Calling `useAddTaskMutation()` returns a **tuple (an array with two elements)**:

```js
const [triggerFunction, resultObject] = useAddTaskMutation();
```

* `triggerFunction` → the function you call to actually perform the mutation (in this case, to add a task).
* `resultObject` → contains metadata about the mutation (e.g. loading state, error info, success status).

---

### ✅ What you’re doing:

You're using just the first item:

```js
const [addTask] = useAddTaskMutation();
```

So now `addTask` is a function you can call like this:

```js
addTask({ value: newTask, completed: false });
```

Under the hood, RTK Query:

* Makes a `POST` request to `http://localhost:3000/tasks`.
* Automatically invalidates the `"Tasks"` tag, which causes `useGetTasksQuery()` to refetch.
* Updates your component state based on the new data.

---

### 🧪 If you want full control

You could also destructure both values:

```js
const [addTask, { isLoading, error, isSuccess }] = useAddTaskMutation();
```

Then you can show loading spinners, error messages, or handle success cases:

```js
if (isLoading) return <p>Adding task...</p>;
if (isSuccess) console.log("Task added!");
if (error) console.error("Failed to add task", error);
```

---

### Summary

✅ `const [addTask] = useAddTaskMutation();`

* `addTask` → function to **trigger** the mutation (`POST` request).
* It's returned by the hook created automatically by `createApi`.
* RTK Query handles the HTTP request, caching, and refetching logic.
* You can also use the second return value to handle mutation state (`isLoading`, `isSuccess`, etc).

Let me know if you’d like an example of using the full `[trigger, result]` pattern in practice!


Great question, Moaz! Let’s break it down in **simple language** with a real-world example so you **clearly understand** the difference between `providesTags` and `invalidatesTags`.

---

### 🔧 First, What are Tags in RTK Query?

Think of **tags** as **labels** you attach to specific data. These labels help RTK Query know:

> ❓“Which part of the data changed?”
> ❓“Which data should I refetch?”

---

### 🟩 `providesTags: ["Tasks"]`

This is used in **queries** (like `getTasks`) to **label** the data.

> 🗣 “Hey RTK, the data returned by this query should be tagged as `'Tasks'`.”

Example:

```js
getTasks: builder.query({
  query: () => "/tasks",
  transformResponse: (tasks) => tasks.reverse(),
  providesTags: ["Tasks"]
});
```

So, now RTK Query knows:

> “Okay, this query (getTasks) gives me the data with the label `Tasks`.”

---

### 🟥 `invalidatesTags: ["Tasks"]`

This is used in **mutations** (like `addTask`) to tell RTK Query:

> 🚨 “I just did something (like add/edit/delete), so the data labeled `Tasks` might be outdated. Please **refetch** it.”

Example:

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  invalidatesTags: ["Tasks"]
});
```

So after `addTask` runs:

* RTK Query looks for any query that has `providesTags: ["Tasks"]`
* It sees `getTasks` provides that tag
* ✅ It **automatically refetches** `getTasks` to keep your UI updated!

---

### 🧠 Real-Life Analogy:

Think of:

* **`providesTags`** as: 📦 “This shelf has a label ‘Tasks’ on it.”
* **`invalidatesTags`** as: 🧹 “I changed something related to ‘Tasks’, so clean (refresh) that shelf.”

---

### ✅ In summary:

| Tag Type          | Used In  | Meaning                                                            |
| ----------------- | -------- | ------------------------------------------------------------------ |
| `providesTags`    | Query    | "This data is labeled as 'Tasks'"                                  |
| `invalidatesTags` | Mutation | "I updated 'Tasks', please refetch any query labeled with 'Tasks'" |

This automatic refetching makes your UI stay up-to-date without you manually calling `refetch()`.

---

Let me know if you want a diagram or real code flow explanation!


Great follow-up question, Moaz!

### 🤔 What if you only use `invalidatesTags` but **not** `providesTags`?

Let’s say you write this:

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  invalidatesTags: ["Tasks"] // ✅ This is here
})
```

But in your `getTasks` query, you do **not** add `providesTags`:

```js
getTasks: builder.query({
  query: () => "/tasks",
  transformResponse: (tasks) => tasks.reverse()
  // ❌ no providesTags
})
```

---

### ⚠️ What happens?

👉 **Nothing will be refetched automatically!**

Because:

> RTK Query sees `invalidatesTags: ["Tasks"]` and asks:
>
> > “Who gave me this tag?”
>
> But if no query gave it (`providesTags`), then RTK Query says:
>
> > “I don’t know which query to refresh... 🤷‍♂️”

So, **your UI will not update** unless you manually call `.refetch()`.

---

### ✅ Conclusion: You **need both** to make it work

| What you do                               | What it means                                               |
| ----------------------------------------- | ----------------------------------------------------------- |
| `providesTags: ["Tasks"]` on `getTasks`   | This query gives data with the label "Tasks"                |
| `invalidatesTags: ["Tasks"]` on `addTask` | This mutation changed something about "Tasks", so update it |

Only when **both** exist, RTK Query knows:

> “Oh! `getTasks` has the tag `Tasks` and `addTask` invalidated `Tasks`, so I’ll refetch `getTasks` automatically.” ✅

---

Let me know if you want to see this visually or in a test example.


You're absolutely right, Moaz!

### ✅ In RTK Query, updates are **pessimistic by default**.

---

### 🔹 What is a **Pessimistic Update**?

A **pessimistic update** means:

* You **wait for the server to respond** before updating the local cache/state.
* Only after the API call **succeeds**, RTK Query will:

  * invalidate the tag (if you've used `invalidatesTags`)
  * and re-fetch the affected data (e.g., the task list).

✅ It's **safe and reliable** but **can feel slow** to the user, especially for interactive UIs.

---

### 🔹 What is an **Optimistic Update**?

An **optimistic update** means:

* You **immediately update the UI** (e.g., remove the task from the list) **before** the server responds.
* If the request later fails, you can **roll back** the optimistic change.

This gives a **faster user experience**, but it’s **risky** unless you handle errors properly.

---

### 🔧 RTK Query: How to do an **Optimistic Update**?

You use `onQueryStarted` in your mutation like this:

```js
deleteTask: builder.mutation({
  query: (id) => ({
    url: `/tasks/${id}`,
    method: "DELETE",
  }),
  async onQueryStarted(id, { dispatch, queryFulfilled }) {
    // optimistic update: update cache immediately
    const patchResult = dispatch(
      api.util.updateQueryData('getTasks', undefined, (draft) => {
        return draft.filter(task => task.id !== id);
      })
    );
    try {
      await queryFulfilled; // wait for server
    } catch {
      patchResult.undo(); // rollback if failed
    }
  },
}),
```

---

### 🧠 Summary:

| Type        | Default in RTK Query? | Behavior                                    |
| ----------- | --------------------- | ------------------------------------------- |
| Pessimistic | ✅ Yes                 | Wait for server response, then update cache |
| Optimistic  | ❌ Manual setup        | Update cache immediately, rollback on error |

Let me know if you want to implement optimistic updates in your task app — I can show you with your actual code.

Great follow-up, Moaz! Let's talk about how you handle **optimistic updates** when the API response might be different from what you **guessed** during the optimistic update. This is very important for **real-world scenarios**.

---

## 🧠 The Problem:

What if the API **modifies** the task before returning it?
For example:

* You send: `{ title: "Learn RTK Query" }`
* Server responds: `{ id: 123, title: "Learn RTK Query", createdAt: "..." }`

If you do a manual optimistic update like:

```js
draft.unshift({ id: crypto.randomUUID(), ...task });
```

This works **only temporarily** — because the real task from the server has **extra fields or a different ID**.

---

## ✅ Solution: Use `updateQueryData` **after** `queryFulfilled`

You have two options:

---

### ✅ Option 1: Optimistic Update (Guess → Fix)

You:

1. Do an optimistic update with a temporary item (e.g., random ID).
2. When the real API response arrives, you **replace** or **fix** the item in the cache.

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  async onQueryStarted(task, { dispatch, queryFulfilled }) {
    const tempId = crypto.randomUUID();

    // Step 1: Optimistic update
    const patchResult = dispatch(
      api.util.updateQueryData("getTasks", undefined, (draft) => {
        draft.unshift({ id: tempId, ...task });
      })
    );

    try {
      const { data: newTaskFromServer } = await queryFulfilled;

      // Step 2: Replace temp task with real task from server
      dispatch(
        api.util.updateQueryData("getTasks", undefined, (draft) => {
          const index = draft.findIndex((task) => task.id === tempId);
          if (index !== -1) {
            draft[index] = newTaskFromServer;
          }
        })
      );
    } catch {
      patchResult.undo();
    }
  },
}),
```

---

### ✅ Option 2: Don’t Guess — Only Update After Server Responds

If you don’t want to guess:

```js
addTask: builder.mutation({
  query: (task) => ({
    url: "/tasks",
    method: "POST",
    body: task,
  }),
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data: newTaskFromServer } = await queryFulfilled;

      // Only update after server confirms
      dispatch(
        api.util.updateQueryData("getTasks", undefined, (draft) => {
          draft.unshift(newTaskFromServer);
        })
      );
    } catch (err) {
      // No update needed, just let it fail
    }
  },
}),
```

---

## ✍️ Summary

| Case                                | What to do                                                    |
| ----------------------------------- | ------------------------------------------------------------- |
| You can guess the shape of the task | Do optimistic update, then replace it later with the real one |
| You can’t guess / want to be safe   | Don’t do optimistic — wait for server response                |

---

Let me know if you want to handle **delete** or **update** with optimistic logic too!


Great question, Moaz — and you're absolutely right to ask **“If `onQueryStarted` can become bloated and risky, then why does RTK Query even offer it?”**

Let’s break this down clearly.

---

## 🚀 Why RTK Query Introduced `onQueryStarted`

RTK Query introduced `onQueryStarted` to allow **powerful control over side effects** at the time an API call is initiated — **before it finishes**.

It’s meant for cases like:

* Optimistic updates (UI changes before server confirms)
* Showing a loading indicator only for certain actions
* Canceling requests or triggering additional logic (e.g. tracking, logging)
* Updating the local cache immediately, then rolling back on failure

Basically, **advanced use-cases** where you want **more than just a fetch**.

---

## ✅ When It’s Useful and Safe

You should use `onQueryStarted` when:

| Situation                                          | Why it's a good fit                |
| -------------------------------------------------- | ---------------------------------- |
| You're toggling a single item (like `isCompleted`) | Easy to update cache               |
| You're adding or removing a single object          | Can `unshift` or `splice` in cache |
| You're sure what the API response will look like   | Easier to simulate                 |
| You need instant UI feedback                       | Optimistic updates feel snappy     |

In those cases, it helps reduce round-trips and improves UX.

---

## ⚠️ Why It Can Become Error-Prone

You’re absolutely right that it becomes **bloated** and **error-prone** when:

* Data is **deeply nested or hierarchical**
* You’re trying to replicate a **complex response shape manually**
* You’re making multiple changes to the state
* You don’t have full control over the data format

In these situations, your code can easily **drift from the real server data**. One small API change → broken optimistic UI.

That’s why **RTK Query defaults to pessimistic behavior** (refetch after mutation) — because it's **safe and consistent**.

---

## ✅ So Why Keep `onQueryStarted`?

Because some apps demand **fine-grained control** and **blazing-fast UI interactions** — especially:

* Real-time collaborative tools
* Mobile apps where network is slow or expensive
* Apps where responsiveness is a top UX priority (like Trello, Notion, or Gmail)

RTK Query lets you choose:

> **Easy and safe (invalidate and refetch)**
> or
> **Advanced and fast (optimistic updates with `onQueryStarted`)**

You get both tools. You choose based on your case.

---

## 🎯 Summary

| Feature            | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `onQueryStarted`   | Gives you full control for **manual updates** and **optimistic UI** |
| Risk of complexity | Only comes when used on **large or unpredictable data**             |
| When to use it     | For **small, predictable, and critical updates**                    |
| Default behavior   | Still pessimistic — **invalidate → refetch** for safety             |

---

Let me know if you want a mini example of good `onQueryStarted` usage and one where it's better to avoid it — I’ll be happy to show both side-by-side.
