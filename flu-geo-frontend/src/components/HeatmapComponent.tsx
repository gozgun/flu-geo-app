import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][];
  options?: L.HeatLayer.HeatLayerOptions;
}

const HeatmapComponent: React.FC<HeatmapLayerProps> = ({ points, options }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = L.heatLayer(points, options);
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapComponent;