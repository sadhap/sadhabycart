
import axios from 'axios';
import { productsFail, productsRequest, productsSuccess} from '../slices/productsSlice';
import { adminProductsRequest,
         adminProductsSuccess,
         adminProductsFail} from '../slices/productsSlice';

export const getProducts =(keyword,price,category,rating,currentPage) => async (dispatch)=>{
    try{
        dispatch(productsRequest())
        let link = `/api/v1/products?page=${currentPage}`;
        if(keyword){
            link += `&keyword=${keyword}`
        }
        if(price){
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }
        if(category){
            link += `&category=${category}`
        }
        if(rating){
            link += `&ratings=${rating}`
        }
        // productsRequest()
        const { data }  =  await axios.get(link);
        dispatch(productsSuccess(data))
}
catch(error){
    dispatch(productsFail(error.response.data.message))
    // console.log(error.response.data.message);
}  
}
// get admin products
export const getAdminProducts  =  async (dispatch) => {

    try {  
        dispatch(adminProductsRequest()) 
        const { data }  =  await axios.get(`/api/v1/admin/products`);
        dispatch(adminProductsSuccess(data))
    } catch (error) {
        //handle error
        dispatch(adminProductsFail(error.response.data.message))
    }
}

