import React, { useEffect, useState } from 'react';
import './DescriptionBox.scss';
import Rating from '../Rating/Rating';
import { useSelector } from 'react-redux';
import { selectUserName } from '../../Redux/ShopSlice';

const DescriptionBox = () => {
  const userName = useSelector(selectUserName);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(storedReviews);
  }, []);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.text && newReview.rating) {
      setReviews((prev) => [...prev, { ...newReview, userCommentName: userName }]);
      setNewReview({ text: '', rating: 0 });
    }
  };

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div 
          className={`description-nav-box ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div 
          className={`description-nav-box ${activeTab === 'reviews' ? 'active' : 'fade'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </div>
      </div>
      <div className="descriptionbox-content">
        {activeTab === 'description' ? (
          <div className="descriptionbox-description">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, fugit corrupti sint eligendi architecto culpa! Corporis, totam saepe! Aliquid voluptatum nisi soluta natus corrupti quis aspernatur nesciunt neque doloribus consequuntur.
            </p>
          </div>
        ) : (
          <div className="descriptionbox-reviews">
            <form onSubmit={handleSubmitReview}>
              <div>
                <label>Rating: </label>
                <select 
                  name="rating" 
                  value={newReview.rating} 
                  onChange={handleReviewChange}
                >
                  <option value="0">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label>Comment: </label>
                <textarea 
                  name="text" 
                  value={newReview.text} 
                  onChange={handleReviewChange} 
                  rows="3"
                ></textarea>
              </div>
              <button type="submit">Submit</button>
            </form>
            {reviews.map((review, index) => (
              <div key={index} className="review">
                <Rating value={review.rating} text={review.text} />
                <p>{`Comment by: ${review.userCommentName}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DescriptionBox;
