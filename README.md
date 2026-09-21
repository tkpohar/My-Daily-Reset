# DataVibe-Insights

A Python-based data cleaning and analysis project created using AI-assisted vibe coding to accelerate design, implementation, and iteration. The project focuses on cleaning raw datasets, extracting meaningful insights, and creating visual charts to support data-driven decision-making.

## Project Goal

This project transforms raw data into a clean, structured dataset and generates analytical outputs such as:

- missing value handling
- duplicate removal
- data type normalization
- summary statistics
- grouping and trend analysis
- chart generation for reporting

## Key Features

- CSV file loading and preprocessing
- Automated data cleaning workflow
- Handling of missing values and incorrect formats
- Numeric conversion and date parsing
- Sales and profit summary analysis
- Grouped insights by region and category
- Visualization of trends using charts

## Project Structure

```text
data-cleaning-analysis-project/
├── README.md
├── requirements.txt
├── .gitignore
├── data/
│   └── sample_data.csv
├── docs/
│   └── project_documentation.md
├── outputs/
│   └── .gitkeep
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── data_cleaning.py
│   ├── analysis.py
│   ├── charts.py
│   └── main.py
└── __init__.py
```

## Tech Stack

- Python 3.9+
- Pandas
- Matplotlib
- Seaborn

## Installation

1. Open a terminal in the project folder.
2. Create a virtual environment (optional but recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run the Project

```bash
python src/main.py
```

The script will:

1. load the sample dataset
2. clean the data
3. generate a summary report
4. save charts in the outputs folder

## Sample Output

After running the script, you can find generated charts such as:

- sales_by_region.png
- sales_distribution.png
- category_summary.png

## Documentation

Detailed guidance is available in [docs/project_documentation.md](docs/project_documentation.md).

## Resume-Friendly Project Summary

Developed a Python-based data cleaning and analysis project using AI-assisted vibe coding to streamline the workflow from raw dataset preparation to exploratory analysis and visualization. The project involved handling missing values, standardizing formats, removing duplicates, summarizing sales performance, and generating charts to communicate insights effectively using Pandas, Matplotlib, and Seaborn.

## Potential Use Cases

- sales trend analysis
- customer data preparation
- operational reporting
- business intelligence dashboards
- academic or personal data projects

## Future Enhancements

- add SQL integration
- include more advanced statistical analysis
- build a web dashboard with Streamlit
- connect to cloud data sources
- add automated reporting in PDF or Excel format
