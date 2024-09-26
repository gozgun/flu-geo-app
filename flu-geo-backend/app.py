from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import json
from get_news import get_google_news

app = Flask(__name__)
CORS(app)

# Load canton boundaries from JSON file
with open('./data/canton_boundaries.json', 'r') as file:
    canton_boundaries = json.load(file)

# Load bird species, virus types, and provenance types from JSON files
with open('./information/birds.json', 'r') as file:
    bird_species = json.load(file)

with open('./information/viruses.json', 'r') as file:
    virus_types = json.load(file)

with open('./information/provenance.json', 'r') as file:
    provenance_types = json.load(file)

def is_within_bounds(lat, lon, bounds):
    """
    Check if a coordinate is within the bounding box.
    """
    return (bounds['min_lat'] <= lat and lat <= bounds['max_lat'] and bounds['min_lon'] <= lon and lon <= bounds['max_lon'])

# Load dataset (e.g., bird flu cases data)
data = pd.read_csv('./data/fake_bird_data_switzerland_v3.csv').dropna()
data["timestamp"] = pd.to_datetime(data["new_timestamp"], format="%d.%m.%Y")
data.drop(columns=["new_timestamp"], inplace=True)

@app.route('/api/filter', methods=['GET'])
def filter_data():
    # Get filter parameters from the front-end
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    cantons = request.args.getlist('cantons[]')
    bird_species_list = request.args.getlist('bird_species[]')
    virus_types_list = request.args.getlist('virus_types[]')
    provenance_types_list = request.args.getlist('provenance_types[]')

    # Start with a copy of the original data
    filtered_data = data.copy()

    print(start_date, end_date)

    # Apply filters sequentially, checking for empty DataFrame after each filter
    filters = [
        ('start_date', lambda df: df[df['timestamp'] >= pd.to_datetime(start_date)] if start_date else df),
        ('end_date', lambda df: df[df['timestamp'] <= pd.to_datetime(end_date)] if end_date else df),
        ('cantons', lambda df: df[df.apply(lambda row: any(is_within_bounds(row['latitude'], row['longitude'], canton_boundaries[canton])
                                for canton in cantons if canton in canton_boundaries), axis=1)] if cantons else df),
        ('bird_species', lambda df: df[df['species'].isin(bird_species_list)] if bird_species_list else df),
        ('virus_types', lambda df: df[df[virus_types_list].any(axis=1)] if virus_types_list else df),
        ('provenance_types', lambda df: df[df['provenance'].isin(provenance_types_list)] if provenance_types_list else df)
    ]

    for filter_name, filter_func in filters:
        filtered_data = filter_func(filtered_data)
        if filtered_data.empty:
            print(f"DataFrame became empty after applying {filter_name} filter")
            return jsonify([])

    # Return the filtered data as JSON
    return jsonify(filtered_data.to_dict(orient='records'))

# New routes for the tabs
@app.route('/api/bird-species', methods=['GET'])
def get_bird_species():
    return jsonify(bird_species)

@app.route('/api/virus-types', methods=['GET'])
def get_virus_types():
    return jsonify(virus_types)

@app.route('/api/provenance-types', methods=['GET'])
def get_provenance_types():
    return jsonify(provenance_types)

@app.route('/api/get_news', methods=['POST'])
def get_news():
    search_phrase = request.json['search_phrase']
    return jsonify(get_google_news(search_phrase))

if __name__ == '__main__':
    app.run(debug=True)