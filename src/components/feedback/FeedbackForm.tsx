import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { feedbackService } from '../../services/feedbackService';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
  cleanliness: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  location: z.number().min(1).max(5),
  amenities: z.number().min(1).max(5),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  bookingId: string;
  propertyId: string;
  onSubmitSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  bookingId,
  propertyId,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      cleanliness: 5,
      communication: 5,
      value: 5,
      location: 5,
      amenities: 5,
    },
  });

  const ratings = watch();

  const onSubmit = async (data: FeedbackFormData) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await feedbackService.submitFeedback({
        bookingId,
        userId: currentUser.uid,
        rating: data.rating,
        comment: data.comment,
        categories: [
          'cleanliness',
          'communication',
          'value',
          'location',
          'amenities'
        ]
      });

      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('feedback.error.submit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (name: keyof FeedbackFormData, value: number) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('feedback.form.rating')}
        </label>
        <div className="mt-1 flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick('rating', star)}
              className={`p-1 ${
                star <= (Number(ratings.rating) || 0)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('feedback.form.comment')}
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'cleanliness', label: t('feedback.form.cleanliness') },
          { name: 'communication', label: t('feedback.form.communication') },
          { name: 'value', label: t('feedback.form.value') },
          { name: 'location', label: t('feedback.form.location') },
          { name: 'amenities', label: t('feedback.form.amenities') },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(name as keyof FeedbackFormData, star)}
                  className={`p-1 ${
                    star <= (Number(ratings[name as keyof FeedbackFormData]) || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {errors[name as keyof FeedbackFormData] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[name as keyof FeedbackFormData]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('feedback.form.submitting') : t('feedback.form.submit')}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm; 