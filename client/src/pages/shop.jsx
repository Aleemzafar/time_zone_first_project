import React from 'react'
import Footer from '../Components/footer'
import Footerup from '../Components/footerup'
import Productforshop from '../Components/productforshop'
import { Link } from 'react-router-dom'

export default function shop() {
  return (
    <div>
      <div className='header'>
        <h1>Watch Shop</h1>
      </div>
      <div>
        <Productforshop/>
      </div>
      <Footerup/>
      <Footer/>
    </div>
  )
}
