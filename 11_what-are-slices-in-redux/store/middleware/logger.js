// MiddleWare
function logger(store) {
	return function (next) {
		return function (action) {
			console.log("store", store);
			console.log("next", next);
			console.log("action", action);

			return next(action);
		};
	};
}

// const logger = (store) => (next) => (action) => {
//   console.log('store: ', store)
//   console.log('next: ', next)
//   console.log('action: ', action)
//   next(action)
// }