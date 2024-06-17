import React, { useEffect, useState } from 'react';
import "./InventoryList.scss"
import { SpinnerImg } from '../../loader/Loader';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from '../../search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilteredInventories, FILTER_INVENTORIES } from '../../../redux/features/inventory/filterSlice';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { deleteInventory, getInventories } from '../../../redux/features/inventory/inventorySlice';
import { Link } from 'react-router-dom';


const InventoryList = ({inventories, isLoading}) => {
    const [search, setSearch] = useState("");
    const filteredInventories = useSelector(selectFilteredInventories);

    const dispatch = useDispatch();

  
  const shortenText  =(text, n) => {
    if (text.length > n) {
        const shortenedText = text.substring(0, n).concat("...");
        return shortenedText;
    }
    return text;
  };

  const delInventory = async (id) => {
    await dispatch(deleteInventory(id))
    await dispatch(getInventories()) 
  }

  const confirmDelete = (id) => {
    confirmAlert({
        title: "Delete Inventory",
        message: 'Are you want to delete it?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => delInventory(id)
          },
          {
            label: 'Cancel',
            // onClick: () => alert('Click No')
          }
        ]
      });
  }

// Begin Pagination using react-piginate

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredInventories.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredInventories.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredInventories.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
};
// End Pagination


  useEffect(() => {
    dispatch(FILTER_INVENTORIES({inventories, search}))
  }, [inventories, search, dispatch])

  return (
    <div className="product-list" >
        <hr />
        <div className="table">
            <div className='--flex-between --felx-dsir-column'>
                <span>
                    <h3>Pantry Items</h3>
                </span>

                <span>
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                </span>
            </div>

            {isLoading && <SpinnerImg/>}

            <div className="table">
                {!isLoading && inventories.length === 0 ? (
                    <p>No inventory found, pleas add a food...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>s/n</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.map((inventory, index) => {
                                    const {_id, name, category, price, quantity} = inventory;
                                    return (
                                        <tr key={_id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {shortenText(name, 16)}
                                            </td>
                                            <td>{category}</td>
                                            <td>{"$"}{price}</td>
                                            <td>{"$"}{quantity}</td>
                                            <td>{"$"}{price * quantity}</td>
                                            <td className='icons'>
                                                <span>
                                                    <Link to={`/inventory-detail/${_id}`} >
                                                        <AiOutlineEye size={25} color={"blue"} />
                                                    </Link>
                                                    
                                                </span>
                                                <span>
                                                    <Link to={`/edit-inventory/${_id}`} >
                                                        <FaEdit size={25} color={"green"} />
                                                    </Link>
                                                </span>
                                                <span>
                                                    <FaTrashAlt size={25} color={"red"} onClick={() => confirmDelete(_id)} />
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                )}
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="Prev"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="activePage"
            />
        </div>

    </div>
  )
}

export default InventoryList