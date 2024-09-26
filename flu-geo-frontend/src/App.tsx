import React, {useState} from 'react';
import SwitzerlandMap from './components/SwitzerlandMap';
import FilterComponent from './components/FilterComponent';
import TabComponent from './components/TabComponent';
import NewsComponent from './components/NewsComponent';

const App: React.FC = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleFilteredData = (data: any[]) => {
    setFilteredData(data);
  };

  return (
    <div>
      <div style={{ display: 'flex', padding: '20px' }}>
        <div style={{ width: '70%' }}>
          <SwitzerlandMap data={filteredData} />
        </div>
        <div style={{ width: '30%' }}>
          <FilterComponent onDataFiltered={handleFilteredData} />
        </div>
      </div>
      <div style={{ display: 'flex', padding: '20px' }}>
        <div style={{ width: '70%' }}>
          <NewsComponent />
        </div>
        <div style={{ width: '30%' }}>
          <TabComponent />
        </div>
      </div>
   </div>
  );
};

export default App;