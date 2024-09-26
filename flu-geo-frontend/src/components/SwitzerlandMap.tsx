import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import HeatmapComponent from './HeatmapComponent';

interface SetHeightOnChangeProps {
    height: number;
  }

interface MapProps {
  center: [number, number];
  zoom: number;
  data: any[];
  height: number;
}

// This function is created by https://stackoverflow.com/users/1851604/hooman
// for the discussion https://stackoverflow.com/questions/70801854/how-change-size-of-map-in-leaflet-v3-react-inmutable-properties
function SetHeightOnChange({ height }: SetHeightOnChangeProps) {
    const map = useMap();

    const mapContainer = map.getContainer();
    mapContainer.style.cssText = `height: ${height}px; width: 100%; position: relative;`;

    return null;
  }

const MapComponent: React.FC<MapProps> = ({ center, zoom, data, height }) => {
  const heatmapPoints: [number, number, number][] = data.map(item => [
    item.latitude,
    item.longitude,
    1 // intensity
  ]);

  return (
    <MapContainer center={center} zoom={zoom} style={{height: height + "px", width: "100%"}}> 
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <HeatmapComponent 
        points={heatmapPoints} 
        options={{
          radius: 7,
          blur: 3,
          maxZoom: 10,
        }}
      />
      <SetHeightOnChange height={height} />
    </MapContainer>
  );
};

const center: [number, number] = [46.8182, 8.2275];
const zoom: number = 7;

interface SwitzerlandMapProps {
    data: any[];
  }

const SwitzerlandMap: React.FC<SwitzerlandMapProps> = ({ data }) => {
    const height = 600;
    return <MapComponent center={center} zoom={zoom} data={data} height={height} />;
  };
export default SwitzerlandMap;