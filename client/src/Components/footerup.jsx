import React from 'react'
import { Box, IconButton } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
export default function footerup() {
    return (
        <div className='footerupmain'>
           <div className="footerup">
           <div className="box"><div className="icons">
                <Inventory2OutlinedIcon sx={{ color: "white", fontSize: 40 }} />
            </div><h1>Free Shipping Method</h1><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit dolores possimus similique.</p></div>
            <div className="box"><div className="icons"><LockOutlinedIcon sx={{ color: "white", fontSize: 40 }} /></div><h1>Secure Payment System</h1><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit dolores possimus similique.</p></div>
            <div className="box"><div className="icons"><RefreshOutlinedIcon sx={{ color: "white", fontSize: 40 }} /></div><h1>Secure Payment System</h1><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit dolores possimus similique.</p></div>
           </div>
        </div>
    )
}
