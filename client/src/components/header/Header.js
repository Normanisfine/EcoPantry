import React from 'react'
import { logoutUser } from '../../services/authServices';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LOGIN, selectName } from '../../redux/features/auth/authSlice';
import { Link, useNavigate } from "react-router-dom";


const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);


  const logOut = async () => {
    await logoutUser();
    dispatch(SET_LOGIN(false));
    navigate("/");
    
  };

  return (
    <div className='--pad header'>
        <div className='--felx-between'>
            <h3>
                <span className='--fw-thin'>Welcome, </span>
                <span className='--color-danger'>{name}</span>
            </h3>
            <button onClick={logOut} className='--btn --btn-danger'>Logout</button>

        </div>
        <hr />
    </div>
  )
}

export default Header