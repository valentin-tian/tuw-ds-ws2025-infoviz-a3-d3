# tuw-ds-ws2025-infoviz-a3-d3

# Great Britain Fatal Road Collisions 1999–2024  
**Information Visualization — Individual Assignment 3 (D3.js)**  
**TU Wien · Master’s in Data Science · 2025W**

This interactive visualization presents fatal road collisions across Great Britain (GB) from **1999 to 2024**.  
It combines spatial, temporal and behavioural perspectives to support analysis and insight generation.

---

## 🚗 About the Visualization

The project includes three coordinated views:

### **1. Map View (left side)**
Shows the **geographical distribution** of fatal collisions for the selected year.  
Each **red dot** represents an individual fatal crash.

This allows users to identify spatial patterns such as:
- clustering around major cities,  
- motorway accident hotspots,  
- regional concentration differences.

---

### **2. Trend Line Chart (top right)**
Displays the **year-by-year change** in total fatal collisions.

Key observations:
- a long-term **downward trend** indicating improved road safety,  
- shorter fluctuations possibly reflecting policy actions, weather patterns, or socio-economic factors.

---

### **3. Hourly Distribution Bar Chart (bottom right)**
Shows what **time of day** fatal crashes occur within the selected year.

Typical pattern:
- peaks around **late afternoon and early evening**,  
- associated with rush-hour traffic and increased road activity.

---

## ▶️ Interactivity

The visualization includes temporal animation controls:

- **Play** — automatically cycles through years **1999–2024**, updating all charts.  
- **Pause** — stops the animation and allows detailed inspection of the currently selected year.

---

## 🛠 Data Preprocessing

The dataset originates from the **UK Department for Transport**  
(*road safety open data*).

Preprocessing steps (Python, `pandas`):

1. Filtered collisions to years **1999–2024**.  
2. Kept only records classified as **fatal**.  
3. Retained variables:  
   - `year`  
   - `longitude`, `latitude`  
   - `date`, `time`  
4. Renamed `collision_year` → `year`.  
5. Removed rows with missing geographic coordinates.  
6. Exported the cleaned dataset as `data_to_viz.csv` for use in D3.

---

## 👨‍💻 Author and Project Links

Created by **[Valentin Tian](https://www.linkedin.com/in/valentintian)**  
as part of the Master's programme in Data Science at TU Wien  
(course *193.187 Information Visualization*, winter semester 2025).

- **Source code repository:**  
  https://github.com/valentin-tian/tuw-ds-ws2025-infoviz-a3-d3

---

## 📊 Data Sources

- **UK Department for Transport – Road Safety Open Data**  
  https://www.gov.uk/government/statistical-data-sets/road-safety-open-data

- **ONS TopoJSON Boundaries**  
  https://github.com/ONSvisual/topojson_boundaries

---

## 🎨 Code & Design Inspiration

Parts of the map projection logic, responsive SVG design and interaction patterns were adapted and extended from:

- **“Walmart’s Growth” by Mike Bostock (D3.js)**  
  https://observablehq.com/@d3/walmarts-growth

All external concepts were reviewed and rewritten to fit the analytical goals and the GB fatal collision dataset.

Technologies used:
- **D3.js** — data binding, map rendering, charts  
- **topojson-client** — geographic boundaries

---

## 🤖 Use of AI Assistance

**ChatGPT 5.1 (OpenAI)** was used as a supplementary tool for:
- debugging JavaScript,  
- refining CSS styling,  
- optimizing HTML layout.

All AI-generated suggestions were reviewed, validated and manually adapted to comply with academic integrity requirements.

---

## © Licence & Credits

© 2025 **Valentin Tian**  
Created as part of *193.187 Information Visualization* (TU Wien).  
Data provided by the UK Department for Transport and ONS TopoJSON datasets.

