import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="description-nav-box">Description</div>
        <div className="description-nav-box fade">Reviews (10)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, fugit corrupti sint eligendi architecto culpa! Corporis, totam saepe! Aliquid voluptatum nisi soluta natus corrupti quis aspernatur nesciunt neque doloribus consequuntur.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
