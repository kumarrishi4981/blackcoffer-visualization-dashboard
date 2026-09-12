# Blackcoffer Data Visualization Dashboard

An enterprise-grade, interactive full-stack analytics dashboard built as part of the **Blackcoffer Visualization Dashboard Test Assignment**. 

The dashboard ingests, queries, and visualizes the 1,000 intelligence records from `jsondata.json` stored in MongoDB, presenting actionable strategic insights across **Intensity**, **Likelihood**, **Relevance**, **Year**, **Country**, **Topics**, **Region**, and **City** with interactive filtering and modern **Vuexy-inspired** UI aesthetics.

---

## 🌟 Key Features & Assignment Compliance

| Requirement | Implementation Details |
| :--- | :--- |
| **Database** | **MongoDB** via Mongoose. Features dual-mode support: connects to any external URI / MongoDB Atlas, or automatically spins up an embedded in-memory MongoDB instance with auto-seeding. |
| **Backend API** | **Node.js + Express.js** REST API with high-performance MongoDB aggregation pipelines for instant chart calculations and multi-filter querying. |
| **Frontend UI** | **React.js + Vite + Tailwind CSS** modeled after the Vuexy admin dashboard design with responsive sidebar, topbar search, and Dark / Light mode toggle. |
| **Interactive Charts** | Powered by **Chart.js** with animations, tooltips, and reactive filtering. |

### Visualized Variables
1. **Intensity & Likelihood Matrix**: Bubble / Scatter chart mapping Likelihood (X) vs Intensity (Y) with **Relevance** dynamically mapped to bubble diameter and topic tooltips.
2. **Yearly Trajectory & Forecast Trends**: Dual-axis line and area charts plotting Average Intensity and Likelihood over the projection horizon (`end_year`).
3. **Sector & Topic Breakdown**: Ranked horizontal bar charts displaying insight volume and average intensity across top industry sectors and topics.
4. **PESTLE Macro-Analysis**: Radar chart evaluating environmental forces (*Industries, Economic, Environmental, Technological, Political, Social*).
5. **Regional Footprint**: Multi-color doughnut chart illustrating geopolitical distribution across continents and territories.
6. **Intelligence Sources & Country Rankings**: Horizontal bar charts displaying top intelligence authorities (EIA, World Bank, etc.) and country contributions.
7. **Executive KPI Cards**: Summary cards for Average Intensity, Likelihood, Relevance, Total Insights, and Country footprint.

### Filters Implemented
- **End Year Filter**: Dropdown with dynamic projection years
- **Topic Filter**: Dropdown with 90+ distinct industry topics
- **Sector Filter**: Dropdown with 18 distinct sectors (Energy, Retail, Financial, etc.)
- **Region Filter**: Dropdown with 23 global regions
- **PESTLE Filter**: Dropdown for macro-environmental factors
- **Source Filter**: Dropdown for intelligence publication sources
- **Country Filter**: Searchable dropdown for 56 countries
- **City Filter**: Dropdown selector for municipal territories
- **SWOT / Keyword Search**: Real-time debounce search across titles, summaries, and topics
- **Instant Reset**: One-click "Reset All" button to restore unfiltered default view

---

## 🏗️ Architecture & Project Structure

```
blackcoffer-dashboard/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seeder
│   ├── models/
│   │   └── Insight.js            # Mongoose Schema
│   ├── controllers/
│   │   └── insightController.js  # Aggregation pipelines & filtering logic
│   ├── routes/
│   │   └── api.js                # REST API endpoints
│   ├── scripts/
│   │   ├── seed.js               # Standalone DB seeder
│   │   └── testDb.js             # DB health test
│   ├── data/
│   │   └── jsondata.json         # Raw dataset (1,000 records)
│   ├── .env                      # Port & MongoDB URI configuration
│   └── server.js                 # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Topbar with dark mode toggle & search
│   │   │   ├── Sidebar.jsx       # Vuexy-inspired navigation
│   │   │   ├── FilterBar.jsx     # All assignment dropdown filters
│   │   │   ├── KpiCards.jsx      # Summary metrics
│   │   │   ├── charts/
│   │   │   │   ├── BubbleMatrixChart.jsx   # Intensity vs Likelihood vs Relevance
│   │   │   │   ├── TrendsLineChart.jsx     # Yearly timeline
│   │   │   │   ├── SectorBarChart.jsx      # Top sectors & topics
│   │   │   │   ├── PestleRadarChart.jsx    # PESTLE radar analysis
│   │   │   │   ├── RegionDoughnutChart.jsx # Regional distribution
│   │   │   │   └── SourceBarChart.jsx      # Sources & countries
│   │   │   ├── DataTable.jsx     # Paginated, sortable data explorer
│   │   │   └── DetailModal.jsx   # Insight modal with source URL links
│   │   ├── services/
│   │   │   └── api.js            # Axios client with Vite proxy
│   │   ├── App.jsx               # Central state & reactive data loading
│   │   └── index.css             # Tailwind styling
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- *(Optional)* **MongoDB** (If not provided, the backend automatically uses an embedded in-memory MongoDB instance with zero configuration required!)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
```
The server will boot on `http://localhost:5000` and confirm:
```
MongoDB Connected successfully to instance...
Database empty. Reading jsondata.json to seed records...
Successfully seeded 1000 records into MongoDB!
Backend server running on http://localhost:5000
```

### 2. Start the Frontend Dashboard
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | None |
| `GET` | `/api/filters/options` | Returns distinct filter lists | None |
| `GET` | `/api/analytics/kpis` | Aggregated averages & counts | `end_year`, `topic`, `sector`, `region`, `pestle`, `source`, `country`, `city`, `search` |
| `GET` | `/api/analytics/charts` | Formatted chart datasets | Same filter parameters |
| `GET` | `/api/data` | Paginated records list | Same filters + `page`, `limit`, `sortBy`, `order` |

---

## 🎨 Design System
- **Theme**: Vuexy Admin aesthetic with modern cards, soft shadows, rounded borders (`rounded-2xl`), and high contrast data typography.
- **Dark Mode**: Full native dark mode with instant toggle in the top navigation bar.
- **Responsive**: Tested across mobile, tablet, and widescreen desktop viewports.
