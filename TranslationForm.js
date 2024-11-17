// src/components/TranslationForm.jsx
import React, { useState, useEffect } from 'react';
import { bslService } from '../services/api';

const TranslationForm = () => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test connection on component mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        await bslService.testConnection();
        console.log('Backend connection successful');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError('Failed to connect to backend service');
      }
    };

    testBackendConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await bslService.translateText(text);
      setTranslation(result.translation);
    } catch (error) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter text to translate..."
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text}
          className={`px-4 py-2 rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </form>

      {translation && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Translation:</h3>
          <div className="p-4 bg-gray-100 rounded">{translation}</div>
        </div>
      )}
    </div>
  );
};

export default TranslationForm;