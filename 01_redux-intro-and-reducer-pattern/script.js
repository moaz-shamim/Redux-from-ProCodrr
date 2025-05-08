// import { createStore } from "redux";

// const initialState = {
// 	post: 0,
// 	name: "Anurag Singh",
// 	age: 26,
// };

// const INCREMENT = "post/increment";
// const DECREMENT = "post/decrement";
// const INCREASE_BY = "post/increaseBy";
// const DECREASE_BY = "post/decreaseBy";

// function reducer(state = initialState, action) {
// 	switch (action.type) {
// 		case INCREMENT:
// 			return { ...state, post: state.post + 1 };
// 		case DECREMENT:
// 			return { ...state, post: state.post - 1 };
// 		case INCREASE_BY:
// 			return { ...state, post: state.post + action.payload };
// 		case DECREASE_BY:
// 			return { ...state, post: state.post - action.payload };
// 		default:
// 			return state;
// 	}
// }

// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());

// console.log(store);

// store.subscribe(() => {
// 	console.log(store.getState());
// });

// store.dispatch({ type: INCREMENT });
// store.dispatch({ type: DECREMENT });
// store.dispatch({ type: INCREASE_BY, payload: 15 });
// store.dispatch({ type: DECREASE_BY, payload: 5 });

// Starting from Scratch
// Understand the concept of mutation here in javascript::::::::::::::::::::::::::::::::::::
let state = {
	count: 0,
	name: "Anurag Singh",
	age: 26,
};

let prevState = state;

// function increment() {
/*** Mutating State ***/
// state.count = state.count + 1;

// 💡 Not Mutating State
// state = { ...state, count: state.count + 1 };
// }

//
// increment();

// console.log("prevState", prevState);
// console.log("state", state);
// console.log(prevState === state);

// Learn the concept of Redux State:::::::::::::::::::::::::::::::::::::::::::::::::::::::

// let reduxState = {
// 	count: 0,
// 	name: "Anurag Singh",
// 	age: 26,
// };

// function reducer(state, action) {
// 	switch (action.type) {
// 		case "post/increment":
// 			return { ...state, count: state.count + 1 };
// 		case "post/decrement":
// 			return { ...state, count: state.count - 1 };
// 		case "post/incrementBy":
// 			return { ...state, count: state.count + action.payload };
// 		case "post/decrementBy":
// 			return { ...state, count: state.count - action.payload };
// 		default:
// 			return state;
// 	}
// }

// reduxState = reducer(reduxState, { type: "post/increment" });
// reduxState = reducer(reduxState, { type: "post/increment" });
// reduxState = reducer(reduxState, { type: "post/decrement" });
// reduxState = reducer(reduxState, { type: "post/decrement" });
// reduxState = reducer(reduxState, { type: "post/incrementBy", payload: 10 });
// console.log("reduxState", reduxState);

// IIt's time to fully implement the redux:::::::::::::::::::::::::::::::::::::::::::

import { createStore } from "redux";

const postCountElement = document.querySelector(".post-count");

console.dir(createStore);
// createStore(reducer, preloadedState, enhancer)

const initialState = {
	count: 0,
	name: "Anurag Singh",
	age: 26,
};

const increment = "post/increment";
const decrement = "post/decrement";
const incrementBy = "post/incrementBy";
const decrementBy = "post/decrementBy";

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

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());

console.log("store", store);
// {dispatch: ƒ, subscribe: ƒ, getState: ƒ, replaceReducer: ƒ, @@observable: ƒ}

const unsubscribe = store.subscribe(() => {
	console.log("getState()", store.getState());
	postCountElement.innerText = store.getState().count;

});

store.dispatch({ type: increment });
store.dispatch({ type: decrement });
store.dispatch({ type: incrementBy, payload: 15 });
store.dispatch({ type: decrementBy, payload: 5 });
store.dispatch({ type: incrementBy, payload: 5 });

unsubscribe(); 

// setTimeout(() => {
// 	store.dispatch({ type: increment });
// }, 2000);


postCountElement.addEventListener("click",()=>{
	store.dispatch({ type: increment })
})