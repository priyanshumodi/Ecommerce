import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from './features/productSlice';
import { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const dispatch = useDispatch()
    const { products, isLoading, error } = useSelector(state => state.product)
    const currentUser = useSelector(state => state.user.currentUser)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [])

    if (isLoading) return <div className="home-title">Loading Data....</div>;
    return (
        <div>
            {currentUser?.role === 'admin' ? (
                <button className="add-product-btn" onClick={() => navigate('/add-product')}>
                    <span className="plus-icon">+</span> Add
                </button>
            ) : (<></>)
            }
            <div className="product-grid">
                {
                    (error || !products.length) ? (
                        <div>
                            <div className="home-title">No data found....</div>;
                        </div>

                    ) : (
                        products?.map(product => (
                            <ProductCard key={product._id} {...product} />
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default ProductList
