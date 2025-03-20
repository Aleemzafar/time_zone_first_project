import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name : "item", 
    initialState :{
        item: [], 
    },
    reducers:{
     getItem : (state, action ) =>{
            state.item = action.payload.map(items => {
                return {id: items._id,price:items.price,name:items.name,amount:items.amount}
            })
     }
    }
})

export const {getItem} = itemSlice.actions;
export default itemSlice.reducer;