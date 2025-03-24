import { Fragment } from 'react'
import logoDelivery from '../public/vite.png'


function App() {

  return (
    <Fragment>
      <h1 className="flex flex-col text-3xl text-red-300">Delivery App</h1>
      <p className=''>some text</p>
      <img src={logoDelivery}/>
    </Fragment>
  )
}

export default App
