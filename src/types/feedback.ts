export interface Feedback {
  id: string;
  userId: string;
  bookingId: string;
  propertyId: string;
  rating: number;
  comment: string;
  cleanliness: number;
  communication: number;
  value: number;
  location: number;
  amenities: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    cleanliness: number;
    communication: number;
    value: number;
    location: number;
    amenities: number;
  };
} 