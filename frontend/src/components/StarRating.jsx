import React from 'react';
import { HiStar } from 'react-icons/hi';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hover, setHover] = React.useState(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <label key={star}>
                    <input
                        type="radio"
                        name="rating"
                        value={star}
                        disabled={readOnly}
                        onClick={() => !readOnly && onRatingChange(star)}
                        style={{ display: 'none' }}
                    />
                    <HiStar
                        className="star-icon"
                        color={(hover || rating) >= star ? "#ffc107" : "#e4e5e9"}
                        size={readOnly ? 20 : 30}
                        onMouseEnter={() => !readOnly && setHover(star)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        style={{ cursor: readOnly ? 'default' : 'pointer', transition: 'color 200ms' }}
                    />
                </label>
            ))}
        </div>
    );
};

export default StarRating;
