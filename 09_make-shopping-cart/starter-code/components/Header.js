import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaShoppingCart } from "react-icons/fa";



export default function Header() {
  const cartItems = useSelector(state => state.cartItems)
  return (
    <header>
      <div className="header-contents">
        <h1>
          <Link to="/">Shopee</Link>
        </h1>
        <Link className="cart-icon" to="/cart">
          <FaShoppingCart size={25}/>
          <div className="cart-items-count">{cartItems.reduce((acc,curr) =>  acc + curr.quantity,0)}</div>
        </Link>
      </div>
    </header>
  )
}
