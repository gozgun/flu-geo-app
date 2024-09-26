import * as L from 'leaflet';

declare module 'leaflet' {
  namespace HeatLayer {
    interface HeatLayerOptions extends L.LayerOptions {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: { [key: number]: string };
    }
  }

  namespace Layer {
    interface LayerOptions {
      heatmap?: HeatLayer.HeatLayerOptions;
    }
  }

  export function heatLayer(
    latlngs: L.LatLngExpression[],
    options?: HeatLayer.HeatLayerOptions
  ): L.Layer;
}