import { Fragment, useEffect, useState } from "react";
import { getProducts } from "../../actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
export default function Footer(){
  const dispatch = useDispatch();
  const { error, productsCount, resPerPage} = useSelector((state) => state.productsState)
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
//   console.log(location);
  const setCurrentPageNo = (pageNo) =>{

      setCurrentPage(pageNo)
     
  }

  useEffect(()=>{
      if(error) {   
          return toast.error(error,{
              position: toast.POSITION.BOTTOM_CENTER
          })
      }
      dispatch(getProducts(null,null,null,null,currentPage)) 
  }, [error, dispatch, currentPage])

    return(
        
    <footer className="py-1">
          {location.pathname === '/'? 
   <Fragment>
      
      {productsCount > 0 && productsCount >resPerPage ? 
                  <div className="d-flex justify-content-center mt-2">
                         <Pagination 
                              activePage={currentPage}
                              onChange={setCurrentPageNo}
                              totalItemsCount={productsCount}
                              itemsCountPerPage={resPerPage}
                              nextPageText={'Next'}
                              firstPageText={'First'}
                              lastPageText={'Last'}
                              itemClass={'page-item'}
                              linkClass={'page-link'}
                         />     
                  </div> : null }
                  </Fragment>:null}
  </footer>
    )
}