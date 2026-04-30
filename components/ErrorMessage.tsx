import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {

  const getErrorMessage = (msg: string) => {
    if (msg.includes('503')) {
      return 'AI is currently busy. Please try again in a moment ⏳';
    }
    if (msg.includes('429')) {
      return 'Daily limit reached. Please try again tomorrow 📅';
    }
    if (msg.includes('API key')) {
      return 'Invalid API key. Please check your configuration ⚠️';
    }
    return 'Something went wrong. Please try again.';
  };

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
      <p className="font-bold">An Error Occurred</p>
      <p>{getErrorMessage(message)}</p>
    </div>
  );
};

export default ErrorMessage;