# Great Britain Fatal Road Collisions 1999 - 2024

## Visualization

The visualization represents a comprehensive view of fatal road collisions across Great Britain (GB) from 1999 to 2024.

The map on the left side shows the geographical distribution of fatal accidents for the selected year, each red point represents an individual collision. This allows users to identify regional concentration patterns of the collisions across GB, such as clusters around major urban areas, highways or high-traffic locations.

The top right line chart illustrates how the total number of fatal collisions has changed over the time. The long-term decreasing trend highlights improvements in road safety, vehicle technology and enforcement during last 25 years, while short-term fluctuations may reflect policy changes, weather patterns or socio-economic factors.

The bottom right bar chart shows the hourly distribution of fatalities within the selected year. Clear peaks during late afternoon and early evening hours correspond to rush-hour traffic and increased road activity.

Together, these three views allow users to explore temporal, spatial and behavioural dimensions of the GB road-safety data, helping to uncover trends, identify risks and support data-driven decision making.

Additionally, interactivity was implemented: by clicking the “Play” button, the data automatically progresses through the entire period from 1999 to 2024. By clicking the “Pause” button, the animation stops, allowing the user to analyze the selected year.

---

## Data preprocessing

The underlying data originate from the UK Department for Transport road casualty statistics and were preprocessed in Python using the `pandas` library. Starting from the raw file, the dataset was filtered to collisions from 1999 to 2024 and to records classified as fatal. For the visualization only the variables `collision_year`, `longitude`, `latitude`, `date` and `time` were retained, the column `collision_year` was renamed to `year` and rows with missing geographic coordinates were removed. The resulting cleaned table was then exported as a `.csv` file and used as the input dataset for the D3-based “Great Britain Fatal Road Collisions 1999 - 2024” visualization.

---

## Author and project links

This project was created by **[Valentin Tian](https://www.linkedin.com/in/valentintian)** as part of the Master's programme in Data Science at TU Wien (course 193.187 Information Visualization, winter semester 2025).

- Demonstration page:  
  https://valentin-tian.github.io/tuw-ds-ws2025-infoviz-a3-d3

- Source code repository:  
  https://github.com/valentin-tian/tuw-ds-ws2025-infoviz-a3-d3

---

## Data sources

- Great Britain road safety open data, provided by the UK Department for Transport:  
  https://www.gov.uk/government/statistical-data-sets/road-safety-open-data

- Administrative boundaries for the United Kingdom, ONS TopoJSON boundaries datasets:  
  https://github.com/ONSvisual/topojson_boundaries/blob/master/geogGBregion.json?short_path=6bd9372

---

## Code and design inspiration

Parts of the map projection, responsive SVG layout and interaction patterns are adapted and extended from a public D3 example and documentation from **“Walmart`s Growth” by Mike Bostock**: https://observablehq.com/@d3/walmarts-growth

The referenced example served as a conceptual template for understanding geographic rendering workflows and map points plotting techniques. All incorporated ideas were carefully reviewed, restructured and extended to fit the specific analytical goals and dataset used in this assignment.

The visualization uses **D3.js** for data binding and drawing and **topojson-client** for handling geographic boundary data.

---

## Use of AI assistance

ChatGPT 5.1 (OpenAI) was used as a supplementary tool to support debugging of JavaScript code, refinement of CSS styling and optimization of the HTML layout. All AI-generated suggestions were reviewed, validated and manually adapted to ensure technical correctness and compliance with academic integrity requirements.

---

© 2025 Valentin Tian. Created as part of the course 193.187 Information Visualization (TU Wien).  
Data sources: UK Department for Transport (Open Data) and ONS TopoJSON boundaries dataset.  
Source code: https://github.com/valentin-tian/tuw-ds-ws2025-infoviz-a3-d3
