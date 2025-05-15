import { useSelector } from "react-redux"
import Product from "../components/Product"

export default function Home (){
    const ProductsList = useSelector((state) => state.products)
    return(
        <div className="products-container">
          {ProductsList.map(({ id, title, rating, price, image }) =>(
            <Product
              key={id}
              productId={id}
              title={title}
              rating={rating}
              price={price}
              imageUrl={image}
            />
          ))}  
        </div>
    )
}