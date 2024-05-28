import React, { useEffect, useState } from 'react';
import './DescriptionBox.scss';
import { List, Form, Input, Button, Rate } from 'antd';
import moment from 'moment';
import { fetchReviews, addReview } from '../../Api/ReviewsApi';

const DescriptionBox = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const totalStars = reviews.reduce((acc, cur) => acc + cur.rating, 0);
  const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        if (product && product.id) {
          const comments = await fetchReviews(product.id);
          setReviews(comments);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviewsData();
  }, [product]);

  useEffect(() => {
    const getToken = () => {
      const storedToken = localStorage.getItem('auth-token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.error('No auth token found.');
      }
    };

    getToken();
  }, []);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (value) => {
    setNewReview((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const response = await addReview(product.id, newReview.text, newReview.rating, token);
      if (response.success) {
        const updatedReviews = [...reviews, response.comment];
        setReviews(updatedReviews);
        setNewReview({ text: '', rating: 0 });
      } else {
        console.error('Error adding comment:', response.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'Reviews' : 'Review'} With ${averageRating.toFixed(1)} stars`}
      itemLayout='horizontal'
      renderItem={(comment) => (
        <List.Item style={{ marginBottom: '10px', borderBottom: '2px solid #ccc' }}>
          <List.Item.Meta
            title={<span style={{ fontWeight: 'bold' }}>User: {comment.userName} - Rating: {comment.rating}</span>}
            description={
              <>
                <p>Comment: {comment.comment}</p>
                <p>Date: {moment(comment.date).format('YYYY-MM-DD HH:mm:ss')}</p>
              </>
            }
            style={{ width: '100%' }}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className='descriptionbox'>
      <div className='descriptionbox-navigator'>
        <div
          className={`description-nav-box ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div
          className={`description-nav-box ${
            activeTab === "reviews" ? "active" : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </div>
      </div>
      <div className='descriptionbox-content'>
        {activeTab === 'description' ? (
          <div className='descriptionbox-description'>
            <p>{product ? product.longDescription : 'Product description not available'}</p>
          </div>
        ) : (
          <div className='descriptionbox-reviews'>
            <CommentList comments={reviews} />
            {token ? (
              <Form onFinish={handleSubmitReview}>
                <Form.Item label='Rating'>
                  <Rate allowHalf onChange={handleRatingChange} value={newReview.rating} />
                </Form.Item>
                <Form.Item label='Comment'>
                  <Input.TextArea rows={4} onChange={handleReviewChange} value={newReview.text} name='text' />
                </Form.Item>
                <Form.Item>
                  <Button htmlType='submit' loading={submitting} type='primary'>
                    Add Comment
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <p>
                Please <a href='/login'>login</a> to leave a review.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
