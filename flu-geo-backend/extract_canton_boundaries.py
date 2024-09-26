import geopandas as gpd
import json

def extract_boundaries(geojson_path, output_path):
    # Load the GeoJSON file containing canton boundaries
    gdf = gpd.read_file(geojson_path)

    # Initialize dictionary to store bounding boxes
    canton_boundaries = {}

    # Loop through each canton in the GeoDataFrame
    for _, row in gdf.iterrows():
        canton_name = row['NAME']  # Access 'NAME' directly
        geometry = row['geometry']  # Access 'geometry'

        if geometry.geom_type == 'Polygon':
            bounds = geometry.bounds
        elif geometry.geom_type == 'MultiPolygon':
            bounds = geometry.unary_union.bounds
        else:
            continue  # Skip if geometry type is not supported

        # Store bounding box coordinates for each canton
        canton_boundaries[canton_name] = {
            'min_lat': bounds[1],  # min latitude
            'max_lat': bounds[3],  # max latitude
            'min_lon': bounds[0],  # min longitude
            'max_lon': bounds[2]   # max longitude
        }

    # Save the boundaries to a JSON file
    with open(output_path, 'w', encoding='utf-8') as outfile:
        json.dump(canton_boundaries, outfile, ensure_ascii=False, indent=4)

    print(f'Canton boundaries have been saved to {output_path}')


# Example usage
if __name__ == "__main__":
    # Replace these paths with the path to your GeoJSON file and desired output path
    geojson_path = 'data/swiss_cantons.geojson'
    output_path = 'data/canton_boundaries.json'
    
    extract_boundaries(geojson_path, output_path)
