import React from 'react'
import "../css/Map.css";

function Map() {
  return (
    <div className='map-page'>
      <div className='block'>
        <p className='title'>Lineups Name</p>
        <p>Author</p>
      </div>

      <div className='options-block'>
        <p className='menu-title'>OPTIONS</p>
        <button className='save-button'>SAVE</button>
        <button className='add-lineup-button'>ADD LINEUP</button>
      </div>


      <div className='map-img'>
        <img src="images/maps/ascent.png"/>
      </div>

    </div>
  )
}

export default Map