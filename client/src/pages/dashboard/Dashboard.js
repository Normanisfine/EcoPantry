import React, { useEffect } from 'react';
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/features/auth/authSlice';
import { getInventories } from '../../redux/features/inventory/inventorySlice';
import InventoryList from '../../components/Inventory/inventoryList/InventoryList';
import InventorySummary from '../../components/Inventory/inventorySummary/InventorySummary';



const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {inventories, isLoading, isError, message} = useSelector((state) => state.inventory);

  useEffect(() =>{
    if (isLoggedIn === true){
      dispatch(getInventories());

    if (isError) {
      console.log(message);
    }

    }
  },[isLoggedIn, isError, message, dispatch]);

    

  return (
    <div>
        <h2>Dashboard</h2>
        <InventorySummary inventories={inventories} />
        <InventoryList inventories={inventories} isLoading={isLoading} />
    </div>
  )
}

export default Dashboard