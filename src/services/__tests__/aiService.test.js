import { getAIResponse, getRecommendations } from '../aiService';

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAIResponse', () => {
    test('returns AI response and recommendations', async () => {
      const mockResponse = {
        response: 'Test response',
        recommendations: [
          {
            id: '1',
            name: 'Test Restaurant',
            type: 'restaurant',
            rating: 4.5,
            price: '€€',
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getAIResponse('Test message');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    test('handles error response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getAIResponse('Test message')).rejects.toThrow('Failed to get AI response');
    });
  });

  describe('getRecommendations', () => {
    test('returns filtered recommendations', async () => {
      const mockRecommendations = [
        {
          id: '1',
          name: 'Test Restaurant',
          type: 'restaurant',
          rating: 4.5,
          price: '€€',
        },
        {
          id: '2',
          name: 'Test Activity',
          type: 'activity',
          rating: 4.0,
          price: '€',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recommendations: mockRecommendations }),
      });

      const result = await getRecommendations('restaurant');

      expect(result).toEqual([mockRecommendations[0]]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('handles empty recommendations', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recommendations: [] }),
      });

      const result = await getRecommendations('restaurant');

      expect(result).toEqual([]);
    });

    test('handles error response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getRecommendations('restaurant')).rejects.toThrow('Failed to get recommendations');
    });
  });
}); 