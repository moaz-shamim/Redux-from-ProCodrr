// Importing required functions from RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Creating the API instance using createApi
export const api = createApi({
	// Base URL for all API calls
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),

	// Defining different endpoints (queries and mutations)
	endpoints: (builder) => {
		return {
			// 🔽 GET tasks from the server
			getTasks: builder.query({
				// Endpoint to fetch tasks
				query: () => "/tasks",

				// Reversing the array so that latest task appears on top
				transformResponse: (tasks) => tasks.reverse(),

				// Tags used for caching and auto-refetching
				providesTags: ["Tasks"],

				// 🧠 Pessimistic update logic: runs when query starts
				async onQueryStarted(task, { dispatch, queryFulfilled }) {
					// Manually updating the cache before response comes
					const patchResult = dispatch(
						api.util.updateQueryData("getTasks", undefined, (draft) => {
							// Add new task at the top optimistically
							draft.unshift({ id: crypto.randomUUID(), ...task });
						})
					);

					try {
						// Wait for actual API response
						await queryFulfilled;
					} catch (error) {
						// Undo cache update if API fails
						patchResult.undo();
					}
				},
			}),

			// 🔽 POST (add) a new task to the server
			addTask: builder.mutation({
				query: (task) => {
					return {
						url: "/tasks",        // API endpoint
						method: "POST",       // HTTP method
						body: task,           // Task data to send
					};
				},
				// Invalidate the Tasks tag to refetch fresh data
				invalidatesTags: ["Tasks"],
			}),

			// 🔽 DELETE a task by ID
			deleteTask: builder.mutation({
				query: (id) => {
					return {
						url: `/tasks/${id}`,
						method: "DELETE",
					};
				},
				// Invalidate cache to update UI with latest task list
				invalidatesTags: ["Tasks"],
			}),

			// 🔽 PATCH (update) an existing task
			updateTask: builder.mutation({
				query: ({ id, ...updatedTask }) => {
					return {
						url: `/tasks/${id}`,
						method: "PATCH",
						body: updatedTask,
					};
				},
				// Invalidate the cache to reflect updated task data
				invalidatesTags: ["Tasks"],
			}),
		};
	},
});

// Exporting auto-generated React hooks for usage in components
export const {
	useGetTasksQuery,
	useAddTaskMutation,
	useDeleteTaskMutation,
	useUpdateTaskMutation,
} = api;
