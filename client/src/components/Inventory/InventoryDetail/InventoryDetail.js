import React, { useEffect } from 'react';
import "./InventoryDetail.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser"
import { selectIsLoggedIn } from '../../../redux/features/auth/authSlice';
import { getInventory } from '../../../redux/features/inventory/inventorySlice';
import Card from "../../card/Card"
import { SpinnerImg } from '../../loader/Loader';
import DOMPurify from "dompurify";




const InventoryDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {inventory, isLoading, isError, message} = useSelector((state) => state.inventory);
  console.log(inventory)//

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };


  useEffect(() =>{
    if (isLoggedIn === true){
      dispatch(getInventory(id));
    }

    if (isError) {
      console.log(message);
    }

  },[isLoggedIn, isError, message, dispatch]);


  return (
    <div className="product-detail">
      <h3 className="--mt">Inventory Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {inventory && (
          <div className="detail">
            <Card cardClass="group">
              {inventory?.image ? (
                <img
                  src={inventory.image.filePath}
                  alt={inventory.image.fileName}
                />
              ) : (
                <p>No image set for this inventory</p>
              )}
            </Card>
            <h4>Inventory Availability: {stockStatus(inventory.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {inventory.name}
            </h4>
            <p>
              <b>&rarr; SKU : </b> {inventory.sku}
            </p>
            <p>
              <b>&rarr; Category : </b> {inventory.category}
            </p>
            <p>
              <b>&rarr; Price : </b> {"$"}
              {inventory.price}
            </p>
            <p>
              <b>&rarr; Quantity in stock : </b> {inventory.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in stock : </b> {"$"}
              {inventory.price * inventory.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(inventory.description),
              }}
            >
            </div>
            <hr />
            <code className="--color-dark">
              Created on: {inventory.createdAt}
            </code>
            <br />
            <code className="--color-dark">
              Last Updated: {inventory.updatedAt}
            </code>
          </div>
        )}
      </Card>
    </div>
  )
}

export default InventoryDetail