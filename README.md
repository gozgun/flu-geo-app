# Geodata Dashboard UI

This project visualizes bird flu data on a map of Switzerland and surrounding regions, providing politicians with tools to filter and analyze patterns while viewing related news and information. The platform emphasizes concise, actionable insights, focusing on geopolitical borders.

![UI Demo](ui_demo.gif)

## Features

### Filters
Users can filter data by:
- Date range (mm/dd/yyyy)
- Swiss cantons (26 available)
- Virus types (H5N1, H5N2, H7N2, H7N8)
- Bird species (Barn Swallow, Blackbird, Chicken, Common Chaffinch, Duck, Eurasian Blue Tit, Eurasian Magpie, European Robin, Goose, Great Tit, House Sparrow, Turkey)
- Provenance type (Wild, Livestock)

Multiple values can be selected for each field, and filters can be reset to show all data by default.

### Filter Guide
A guide offers additional details about bird species, their cultivation areas, and associated health risks. A brief description of each virus present in the dataset is also provided.

### Mapfile

A heatmap illustrates the intensity and frequency of bird flu cases. The map is centered on Switzerland, with zoom functionality for more specific geographic details.

### News
The news section displays six relevant articles on "bird flu Switzerland" in English. Each article includes the title, source, date, a brief summary, and a link to the full article. News is retrieved from Google News.

### Reusability
The project divides functionality into components whcih can be reused for other map visualizations or filtering tasks. The **Flask backend** is adaptable to different datasets, making the filtering and API logic easy to repurpose. The **Leaflet map** can be reused with other geospatial data, and the news retrieval system can be applied to different topics. Additionally, the data structures for species, virus types, and regions are designed to be extended without major changes.

### Interoperability
The **Flask API** follows HTTP standards, making it easy for external systems to consume the data. News is retrieved dynamically using Google News' API, enabling third-party content interaction. Future CSV export functionality will allow data sharing with external tools like Excel.

#### NOTE: Date Adjustments
The original dataset includes timestamps between the years 5970 and 7437. Due to limitations in Unix time representation ( [Year 2038 problem](https://en.wikipedia.org/wiki/Year_2038_problem) ), the original dataset was modified to fit within a range of 01.01.2015 – 31.12.2017. The mapping is as follows:
- Years starting with 5XXX → 2015
- Years starting with 6XXX → 2016
- Years starting with 7XXX → 2017

These mapped values are saved in a new column, `new_timestamp`, and used throughout the application.

## Getting Started

Clone the repository
```bash
git clone https://github.com/gozgun/flu-geo-app.git
```

### Backend Installation

#### Prerequisites:
- Python 3.6 or higher
- pip (Python package installer)

1. Navigate to the backend directory:
    ```bash
    cd flu-geo-backend
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the Flask development server:
    ```bash
    python3 app.py
    ```


### Frontend Installation

#### Prerequisites:
- Node.js
- npm (Node Package Manager)

1. Navigate to the frontend directory:
    ```bash
    cd flu-geo-frontend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

Visit `http://localhost:3000` to view the app.

## Architecture

The project consists of a front-end built with React and TypeScript and a Flask-based backend API for filtering and retrieving bird flu data and news.

### Key Libraries:
- **Map and Heatmap**: Implemented using the [Leaflet library](https://react-leaflet.js.org/) and [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat).
- **News Retrieval**: Uses the `requests` library to query Google News, filtering results to Switzerland and English language content.
- **Canton Filtering**: Canton coordinates are extracted from a GeoJSON file obtained from [Swiss Boundaries GeoJSON](https://labs.karavia.ch/swiss-boundaries-geojson/), enabling geographic filtering based on boundaries.

### Backend Folder Structure
```
├── app.py                                  # Application to handle API requests
├── data
│   ├── canton_boundaries.json              # Canton coordinates (N/W/S/E)
│   ├── fake_bird_data_switzerland_v3.csv   # Bird flu cases data
│   └── swiss_cantons.geojson               # GEOJSON file that contains canton boundaries in Switzerland
├── extract_canton_boundaries.py            # Python function to extract canton boundaries from a JSON file
├── get_news.py                             # Python function to extract relevant news
├── information
│   ├── birds.json                          # Information about bird types
│   ├── provenance.json                     # Information about provenance types
│   └── viruses.json                        # Information about virus types
└── requirements.txt                        # Required libraries
```

### Frontend Folder Structure
```
src
│   ├── App.tsx                   # Component to render the UI structure
│   ├── assets
│   │   ├── css                   # Styles specific to UI components
│   │   │   ├── FilterComponent.css
│   │   │   ├── index.css
│   │   │   ├── NewsComponent.css
│   │   │   └── TabComponent.css
│   │   └── leaflet
│   │       └── leaflet-heat.d.ts # Type definitions for Leaflet Heatmap
│   ├── components
│   │   ├── FilterComponent.tsx   # Filtering the data across multiple criteria
│   │   ├── HeatmapComponent.tsx  # Display heatmap 
│   │   ├── NewsComponent.tsx     # Display bird flu related news
│   │   ├── SwitzerlandMap.tsx    # Display map of Switzerland and surroundings
│   │   └── TabComponent.tsx      # Display short info about filter values
│   ├── index.tsx                 # Entry to the React app
```

## Future Work

### 1. Exporting Filtered Data
**Benefit**: Exporting data allows users to save and further analyze the filtered results outside the platform and offline. This feature is particularly useful for politicians who may want to review data in formats compatible with their internal tools (e.g., Excel or CSV). It can also enhance collaboration by enabling data sharing.

**Implementation**: 
A simple approach is to add a button labeled "Export Data" that generates a downloadable file in CSV format based on the filters applied. Libraries that handle CSV generation are widely available for both front-end and back-end development. The process involves retrieving the filtered data and converting it into a CSV format with appropriate headers for each field. Then, the file can be downloaded with a single click.

### 2. Printing the Page as a Report
**Benefit**: This feature allows users to create a hard copy of the data visualization and filters applied, offering a simple way to share results with stakeholders or archive reports. It also allows users to easily attach visual aids and summaries to formal documents.

**Implementation**: 
Provide a "Print Report" button that uses the browser’s built-in printing functionality. With simple formatting adjustments (such as removing unnecessary UI elements for the printed version), the entire page can be prepared for a clean print. This can include a summary of the filters applied, the heatmap, and key data points. No complex logic is required, as the browser’s print functionality handles most of the work.

### 3. Chatbot Integration for Summarization
**Benefit**: A chatbot that summarizes filtered results in plain language can be extremely useful for politicians who need quick, digestible insights without sifting through raw data. By simplifying complex data, it enhances the user experience and promotes data-driven decision-making.

**Implementation**: 
Use chatbot services like Rispose or similar tools via API integration. The chatbot could summarize filtered data into short paragraphs or answer specific questions. To implement this simply, a chat interface can be embedded on the dashboard, where users can type queries like "Summarize today's bird flu data" or "What were the highest reported cases this week?" The chatbot would use the filtered data to generate a concise summary. APIs make it easy to pass data and retrieve responses.

### 4. Timelapse Chart Highlighting Peaks and Dips
**Benefit**: A timelapse chart allows users to visually track changes over time, making it easier to spot trends, peaks, and dips in bird flu cases. Highlighting key events or abnormal spikes provides useful insights for quick decision-making, such as when cases surged or diminished.

**Implementation**: 
Implement a timeline slider that lets users move through different periods, automatically updating the heatmap or chart. Key events, like sudden spikes in cases, could be flagged on the chart with annotations explaining possible causes. Many charting libraries (such as Chart.js) allow for dynamic chart creation, and additional features like highlighting peaks can be done with a few visual markers and tooltips for context.

### 5. Mobile Compatibility
**Benefit**: Ensuring mobile compatibility allows users to access the platform on various devices, including smartphones and tablets. This flexibility is crucial for politicians and other stakeholders who may need to review data on the go, enhancing accessibility and convenience.

**Implementation**: 
Adopt responsive design principles using CSS frameworks like Bootstrap or Tailwind CSS. Ensure that all UI components, including maps, filters, and charts, are adaptable to different screen sizes. Test the application on various devices to identify and fix any usability issues. Additionally, consider touch-friendly interactions for mobile users.

### 6. Temporary Data Upload
**Benefit**: Allowing users to upload data temporarily ensures that sensitive information is not stored permanently. This feature is useful for users who need to analyze specific datasets without the risk of data retention.

**Implementation**: 
Provide an upload interface where users can drag and drop their data files. Use in-memory storage or temporary file storage mechanisms to handle the uploaded data. Ensure that the data is automatically deleted after the session ends or after a specified period. Implement security measures to prevent unauthorized access to the uploaded data.
