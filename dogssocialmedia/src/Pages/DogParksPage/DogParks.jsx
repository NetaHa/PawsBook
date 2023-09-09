import React, { useState } from 'react';
import './DogParks.css';
import MainLayout from '../../layouts/MainLayout';

const DogParksPage = () => {
  const [selectedArea, setSelectedArea] = useState('');

  const dogParks = {
    north: [
      { name: "Haifa Gan Hakipodim", image: "./parksIMG/haifa-park.jpg" },
      { name: "Acre Green Spot", image: "./parksIMG/acre-park.jpg" },
      { name: "Nahariya Gan HaShelosha", image: "./parksIMG/nahariya-park.jpg" },
    ],
    center: [
      { name: "Tel Aviv Gan HaAtzmaut", image: "./parksIMG/telaviv-park.jpg" },
      { name: "Herzliya Pinsker Park", image: "./parksIMG/herzliya-park.jpg" },
      { name: "Petah Tikva Hadar Ganim", image: "./parksIMG/petah-tikva-park.jpg" },
    ],
    south: [
      { name: "Beersheba Ganei Omer", image: "./parksIMG/beersheba-park.jpg" },
      { name: "Kibbutz Nahal Oz Gan HaBesor", image: "./parksIMG/nahal-oz-park.jpg" },
      { name: "Ashkelon Ganei Huga", image: "./parksIMG/ashkelon-park.jpg" },
    ],
  };

  return (
    <MainLayout>
      <div className="parks-container">
        <h1>Choose an Area in Israel</h1>

        <div className="area-selector">
          <button onClick={() => setSelectedArea('north')}>North</button>
          <button onClick={() => setSelectedArea('center')}>Center</button>
          <button onClick={() => setSelectedArea('south')}>South</button>
        </div>

        {selectedArea && (
          <div className="parks-content">
            {dogParks[selectedArea].map((park, index) => (
              <div className="park-item" key={index}>
                <img src={park.image} alt={park.name} />
                <h3>{park.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DogParksPage;
