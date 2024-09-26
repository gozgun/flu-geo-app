import React, { useState, useEffect } from 'react';
import '../assets/css/TabComponent.css';

interface DataItem {
  label: string;
  value: string;
  description: string;
  image?: string;
}

const TabComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [birdSpecies, setBirdSpecies] = useState<DataItem[]>([]);
  const [virusTypes, setVirusTypes] = useState<DataItem[]>([]);
  const [provenanceTypes, setProvenanceTypes] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [birdResponse, virusResponse, provenanceResponse] = await Promise.all([
          fetch('http://localhost:5000/api/bird-species'),
          fetch('http://localhost:5000/api/virus-types'),
          fetch('http://localhost:5000/api/provenance-types')
        ]);

        if (!birdResponse.ok || !virusResponse.ok || !provenanceResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const birdData = await birdResponse.json();
        const virusData = await virusResponse.json();
        const provenanceData = await provenanceResponse.json();

        setBirdSpecies(birdData);
        setVirusTypes(virusData);
        setProvenanceTypes(provenanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderAccordion = (items: DataItem[]) => (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button className="accordion-header" onClick={() => toggleAccordion(index)}>
            {item.label}
          </button>
          <div className="accordion-content">
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const toggleAccordion = (index: number) => {
    const accordionContent = document.getElementsByClassName('accordion-content')[index] as HTMLElement;
    if (accordionContent.style.maxHeight) {
      accordionContent.style.maxHeight = '';
    } else {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
    }
  };

  return (
    <div className="tab-component">
      <h2>Information About Filters</h2>
      <div className="tab-headers">
        <button className={activeTab === 0 ? 'active' : ''} onClick={() => setActiveTab(0)}>Bird Species</button>
        <button className={activeTab === 1 ? 'active' : ''} onClick={() => setActiveTab(1)}>Virus Types</button>
        <button className={activeTab === 2 ? 'active' : ''} onClick={() => setActiveTab(2)}>Provenance Types</button>
      </div>
      <div className="tab-content">
        {activeTab === 0 && renderAccordion(birdSpecies)}
        {activeTab === 1 && renderAccordion(virusTypes)}
        {activeTab === 2 && renderAccordion(provenanceTypes)}
      </div>
    </div>
  );
};

export default TabComponent;
