import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    const saveProduct = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8081/products', {
            title: title,
            price: price
        }, {
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
        });

        navigate("/products");
    }

    return (
        <div className="container">
            <form onSubmit={ saveProduct }>
                <div className="form-group mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={ title } onChange={ (e) => setTitle(e.target.value) } />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Price</label>
                    <input type="text" className="form-control" value={ price } onChange={ (e) => setPrice(e.target.value) } />
                </div>
                <div className="form-group mb-3">
                    <button className="btn btn-primary">Save</button>
                    <button className="btn btn-warning" onClick={() => navigate("/products")}>Cancel</button>
                </div>
            </form>
        </div>
    )
};

export default AddProduct;
