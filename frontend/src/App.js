import './App.css';
import './Mobileview.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/product/productDetail';
import ProductSearch from './components/product/productSearch';
import Login from './components/user/Login';
import Register from './components/user/register';
import store from './store'
import { loadUser } from './actions/userActions';
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/route/ProtectedRoute';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/updateProfile';
import UpdatePassword from './components/user/updatePassword';
import ForgotPassword from './components/user/forgotPassword';
import ResetPassword from './components/user/resetPassword';
import Cart from './components/cart/cart';
import Shipping from './components/cart/shipping';
import ConfirmOrder from './components/cart/confirmOrder';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './components/cart/payment';
import OrderSuccess from './components/cart/orderSuccess';
import UserOrders from './components/order/userOrders';
import OrderDetail from './components/order/orderDetail';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/productLIst';
import NewProduct from './components/admin/newProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/orderList';
import UpdateOrder from './components/admin/updateOrder';
import UserList from './components/admin/userList';
import UpdateUser from './components/admin/updateUser';
import ReviewList from './components/admin/reviewList';
function App() { 
  const [stripeApiKey, setStripeApiKey] = useState("")
  useEffect(() => {
    store.dispatch(loadUser)
    async function getStripeApiKey(){

      const {data} = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
  },[])

  return (
    <Router>
      <div className="App">

        
        <HelmetProvider>    
          <Header/>
          <div className="container container-fluid">
          <ToastContainer theme='dark'/>
          <Routes>
          {/* <Route path='/' element={ <ProtectedRoute isAdmin={true}><Home/></ProtectedRoute>}/> */}
          <Route path='/' element={ <Home/>}/>
          <Route path='/search/:keyword' element={<ProductSearch/>}/>
          <Route path='/product/:id' element={<ProductDetail/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute> } />
          <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute> } />
          <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute> }/>
          <Route path='/password/forgot' element={<ForgotPassword/> } />
          <Route path='/password/reset/:token' element={<ResetPassword/> } />
          <Route path='/cart' element={<Cart/> } />
          <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute> } />
          <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute> } />
          <Route path='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute> } />
          <Route path='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute> } />
          <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute> } />
          {stripeApiKey && <Route path='/payment' element={<ProtectedRoute> <Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute> } />} 
          </Routes>
          </div>
          <Routes>
          <Route path='/admin/dashboard' element={ <ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute> } />
                  <Route path='/admin/products' element={ <ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute> } />
                  <Route path='/admin/products/create' element={ <ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute> } />
                  <Route path='/admin/product/:id' element={ <ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute> } />
                  <Route path='/admin/orders' element={ <ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute> } />
                  <Route path='/admin/order/:id' element={ <ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute> } />
                  <Route path='/admin/users' element={ <ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute> } />
                  <Route path='/admin/user/:id' element={ <ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute> } />
                  <Route path='/admin/reviews' element={ <ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute> } />
          </Routes>
           <Routes>
            <Route path='/' element={<Footer/>}/>
            <Route path='admin/dashboard' element={<Footer/>}/>
            <Route path='/myprofile' element={<Footer/>}/>
            <Route path='/cart' element={<Footer/>}/>
            <Route path='/orders' element={<Footer/>}/>
            <Route path='/order/:id' element={<Footer/>}/>
            <Route path='/order/success' element={<Footer/>}/>
            <Route path='/order/confirm' element={<Footer/>}/>
            <Route path='/product/:id' element={<Footer/>}/>
            <Route path='/search/:keyword' element={<Footer/>}/>
            <Route path='/admin/products/create' element={<Footer/>}/>
            <Route path='/admin/orders' element={<Footer/>}/>
           </Routes>
       </HelmetProvider>
     </div>
    </Router>
  );
}
export default App;
