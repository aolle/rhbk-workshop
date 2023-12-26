import React from 'react'
import config from "../config/app.user.config.json"
import UserCRUD from '../components/crud/UsersCRUD';

const User = () => {
    return <UserCRUD config={config}/> 
};

export default User;