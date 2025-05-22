import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CartIcon from "../assets/cart-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchProducts,
	fetchProductsError,
	updateAllProducts,
} from "../store/slices/productsSlice";
import {
	fetchCartItems,
	fetchCartItemsError,
	loadCartItems,
} from "../store/slices/cartSlice";
import { fetchData } from "../store/middleware/api";

export default function Header() {
	const dispatch = useDispatch();
	useEffect(() => {
		// dispatch({
		//   type:"api/makeCall",
		//   payload: {
		//     url : "products",
		//     onStart:fetchProducts.type,
		//     onSuccess : updateAllProducts.type,
		//     onError: fetchProductsError.type,
		//   }
		// })

		// dispatch({
		//   type:"api/makeCall",
		//   payload: {
		//     url : "carts/5",
		//     onStart:fetchCartItems.type,
		//     onSuccess : loadCartItems.type,
		//     onError: fetchCartItemsError.type,
		//   }
		// })

		dispatch(
			fetchData({
				url: "products",
				onStart: fetchProducts.type,
				onSuccess: updateAllProducts.type,
				onError: fetchProductsError.type,
			})
		);

		dispatch(
			fetchData({
				url: "carts/5",
				onStart: fetchCartItems.type,
				onSuccess: loadCartItems.type,
				onError: fetchCartItemsError.type,
			})
		);

		// dispatch(fetchProducts())
		// fetch('https://fakestoreapi.com/products')
		//   .then((res) => res.json())
		//   .then((data) => {
		//     dispatch(updateAllProducts(data))
		//   })
		//   .catch(() => {
		//     dispatch(fetchProductsError())
		//   })

		// dispatch(fetchCartItems())
		// fetch('https://fakestoreapi.com/carts/5')
		//   .then((res) => res.json())
		//   .then((data) => {
		//     dispatch(loadCartItems(data))
		//   })
		//   .catch(() => {
		//     dispatch(fetchCartItemsError())
		//   })
	}, []);
	const cartItems = useSelector((state) => state.cartItems.list);
	return (
		<header>
			<div className="header-contents">
				<h1>
					<Link to="/">Shopee</Link>
				</h1>
				<Link className="cart-icon" to="/cart">
					<img src={CartIcon} alt="cart-icon" />
					<div className="cart-items-count">
						{cartItems.reduce(
							(accumulator, currentItem) => accumulator + currentItem.quantity,
							0
						)}
					</div>
				</Link>
			</div>
		</header>
	);
}
