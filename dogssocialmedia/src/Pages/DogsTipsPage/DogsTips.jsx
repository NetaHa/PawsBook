import React from 'react';
import './DogsTips.css';
import MainLayout from '../../layouts/MainLayout';

const DogsTipsPage = () => {
  const tips = [
    'Make sure to take your dog for a walk at least once a day.',
    'Always provide fresh water for your dog.',
    'Train your dog with positive reinforcement techniques.',
    'Socialize your dog from a young age to ensure they are friendly with other dogs and people.',
    'Regular vet check-ups are essential to ensure your dog remains healthy.',
  ];

  return (
    <MainLayout>
      <div className="tips-container">
        <h1>Dog Owner Tips</h1>
        <div className="tips-content">
          {tips.map((tip, index) => (
            <div className="tip-item" key={index}>
              <img src={`./tipsIMG/dog-tip-${index + 1}.jpg`} alt={`Tip ${index + 1}`} />
              <h3>{tip}</h3>
            </div>
          ))}
        </div>
        <h2>For more tips! click <a href='http://google.com' target="_blank" rel="noopener noreferrer">here</a></h2>
      </div>
    </MainLayout>
  );
};

export default DogsTipsPage;
