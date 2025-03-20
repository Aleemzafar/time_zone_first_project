import {configureStore} from '@reduxjs/toolkit';
import  itemReducer  from './itemSlice';


const store = configureStore({
    reducer:{
        item : itemReducer,
    },
})
export default store;