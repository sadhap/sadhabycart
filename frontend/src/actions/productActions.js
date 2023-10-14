
import axios from 'axios';
import { productFail, 
  productRequest, 
  productSuccess, 
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  reviewsRequest,
  reviewsFail,
  reviewsSuccess,
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  } from '../slices/productSlice';


export const getProduct = id => async (dispatch) => {
  try {  
      dispatch(productRequest()) 
      const { data }  = await axios.get(`/api/v1/product/${id}`);
      
      dispatch(productSuccess(data))
  } catch (error) {
      //handle error
      dispatch(productFail(error.response.data.message))
      
  }
}

// create review actions
export const createReview = reviewData => async (dispatch) => {

  try {  
      dispatch(createReviewRequest()) 
      const config = {
          headers : {
              'Content-type': 'application/json'
          }
      }
      const { data }  =  await axios.put(`/api/v1/review`,reviewData, config);
      dispatch(createReviewSuccess(data))
  } catch (error) {
      //handle error
      dispatch(createReviewFail(error.response.data.message))
  }
  
}
//   delete products action
export const deleteProduct  =  id => async (dispatch) => {

  try {  
      dispatch(deleteProductRequest()) 
      await axios.delete(`/api/v1/admin/product/${id}`);
      dispatch(deleteProductSuccess())
  } catch (error) {
      //handle error
      dispatch(deleteProductFail(error.response.data.message))
  }
  
}
// create new products request actions
export const createNewProduct  =  productData => async (dispatch) => {

  try {  
      dispatch(newProductRequest()) 
      const { data }  =  await axios.post(`/api/v1/admin/product/new`, productData);
      dispatch(newProductSuccess(data))
  } catch (error) {
      //handle error
      dispatch(newProductFail(error.response.data.message))
  }
  
}
//updateProduct
export const updateProduct  =  (id, productData) => async (dispatch) => {

  try {  
      dispatch(updateProductRequest()) 
      const { data }  =  await axios.put(`/api/v1/admin/product/${id}`, productData);
      dispatch(updateProductSuccess(data))
  } catch (error) {
      //handle error
      dispatch(updateProductFail(error.response.data.message))
  }
  
}


export const getReviews =  id => async (dispatch) => {

  try {  
      dispatch(reviewsRequest()) 
      const { data }  =  await axios.get(`/api/v1/admin/reviews`,{params: {id}});
      dispatch(reviewsSuccess(data))
  } catch (error) {
      //handle error
      dispatch(reviewsFail(error.response.data.message))
  }
  
}

export const deleteReview =  (productId, id) => async (dispatch) => {

  try {  
      dispatch(deleteReviewRequest()) 
      await axios.delete(`/api/v1/admin/review`,{params: {productId, id}});
      dispatch(deleteReviewSuccess())
  } catch (error) {
      //handle error
      dispatch(deleteReviewFail(error.response.data.message))
  }
  
}