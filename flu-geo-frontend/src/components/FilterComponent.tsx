import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../assets/css/FilterComponent.css';
import axios from 'axios';

interface FilterOptions {
  startDate: string;
  endDate: string;
  cantons: string[];
  birdSpecies: string[];
  virusTypes: string[];
  provenanceTypes: string[];
}

const swissCantons = ['Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 'Basel-Stadt', 'Bern', 
'Fribourg', 'Genève', 'Glarus', 'Graubünden', 'Jura', 'Luzerne', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 
'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zürich'].map(canton => ({ label: canton, value: canton }));

const birdSpecies = ['Barn Swallow', 'Blackbird', 'Chicken', 'Common Chaffinch', 'Duck', 'Eurasian Blue Tit', 
'Eurasian Magpie', 'European Robin', 'Goose', 'Great Tit', 'House Sparrow', 'Turkey'].map(species => ({ label: species, value: species }));

const virusTypes = ['H5N1', 'H5N2', 'H7N2', 'H7N8'].map(virus => ({ label: virus, value: virus }));
const provenanceTypes = ['Livestock', 'Wild'].map(type => ({ label: type, value: type }));

const initialFilterOptions: FilterOptions = {
  startDate: '',
  endDate: '',
  cantons: [],
  birdSpecies: [],
  virusTypes: [],
  provenanceTypes: [],
};

interface FilterComponentProps {
  onDataFiltered: (data: any[]) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onDataFiltered }) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilterOptions);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (selectedOptions: any, category: keyof FilterOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setFilters(prev => ({ ...prev, [category]: selectedValues }));
  };

  const handleFilter = () => {
    // Call the back-end API with the selected filters
    axios.get('http://127.0.0.1:5000/api/filter', {
      params: {
        start_date: filters.startDate,
        end_date: filters.endDate,
        cantons: filters.cantons,
        bird_species: filters.birdSpecies,
        virus_types: filters.virusTypes,
        provenance_types: filters.provenanceTypes,
      }
    })
    .then(response => {
      onDataFiltered(response.data); // Pass the filtered data to the parent component
    })
    .catch(error => {
      console.error('Error fetching filtered data:', error);
    });
  };

  const handleReset = () => {
    setFilters(initialFilterOptions);
    handleFilter();
  };

  // Automatically apply filters on component mount (to load data by default)
  useEffect(() => {
    handleFilter();
  }, [filters]);  // Empty dependency array ensures this runs only once when the component mounts


  return (
    <div className="filter-box">
      <h2>Filters</h2>

      {/* Date filters */}
      <div className="filter-section">
        <label>Start Date:</label>
        <input type="date" name="startDate" value={filters.startDate} onChange={handleDateChange} className="date-input" />
        <label>End Date:</label>
        <input type="date" name="endDate" value={filters.endDate} onChange={handleDateChange} className="date-input" />
      </div>

      {/* Cantons filter */}
      <div className="filter-section">
        <label>Regions:</label>
        <Select
          isMulti
          options={swissCantons}
          value={swissCantons.filter(canton => filters.cantons.includes(canton.value))}
          onChange={(selected) => handleSelectChange(selected, 'cantons')}
          className="multi-select"
          placeholder="Select Regions..."
        />
      </div>

      {/* Bird Species filter */}
      <div className="filter-section">
        <label>Bird Species:</label>
        <Select
          isMulti
          options={birdSpecies}
          value={birdSpecies.filter(species => filters.birdSpecies.includes(species.value))}
          onChange={(selected) => handleSelectChange(selected, 'birdSpecies')}
          className="multi-select"
          placeholder="Select Bird Species..."
        />
      </div>

      {/* Virus Types filter */}
      <div className="filter-section">
        <label>Virus Types:</label>
        <Select
          isMulti
          options={virusTypes}
          value={virusTypes.filter(virus => filters.virusTypes.includes(virus.value))}
          onChange={(selected) => handleSelectChange(selected, 'virusTypes')}
          className="multi-select"
          placeholder="Select Virus Types..."
        />
      </div>

      {/* Provenance Types filter */}
      <div className="filter-section">
        <label>Provenance Types:</label>
        <Select
          isMulti
          options={provenanceTypes}
          value={provenanceTypes.filter(type => filters.provenanceTypes.includes(type.value))}
          onChange={(selected) => handleSelectChange(selected, 'provenanceTypes')}
          className="multi-select"
          placeholder="Select Provenance Types..."
        />
      </div>

      {/* Buttons for Apply and Reset */}
      <div className="button-group">
        <button onClick={handleFilter}>Apply Filters</button>
        <button onClick={handleReset}>Reset Filters</button>
      </div>
    </div>
  );
};

export default FilterComponent;