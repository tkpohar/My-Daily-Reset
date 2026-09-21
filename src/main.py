from pathlib import Path

from analysis import get_region_summary, get_summary_statistics, get_category_summary
from charts import plot_category_summary, plot_sales_by_region, plot_sales_distribution
from config import DEFAULT_DATA_FILE, OUTPUT_DIR
from data_cleaning import clean_dataset, load_dataset


def main():
    """Run the full data cleaning and analysis workflow."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    raw_data = load_dataset(DEFAULT_DATA_FILE)
    cleaned_data = clean_dataset(raw_data)

    summary = get_summary_statistics(cleaned_data)
    region_summary = get_region_summary(cleaned_data)
    category_summary = get_category_summary(cleaned_data)

    plot_sales_by_region(cleaned_data, OUTPUT_DIR / "sales_by_region.png")
    plot_sales_distribution(cleaned_data, OUTPUT_DIR / "sales_distribution.png")
    plot_category_summary(cleaned_data, OUTPUT_DIR / "category_summary.png")

    print("Data Cleaning and Analysis Report")
    print("-" * 40)
    print(f"Rows: {summary['rows']}")
    print(f"Columns: {summary['columns']}")
    print(f"Total Sales: ${summary['total_sales']:.2f}")
    print(f"Average Sales: ${summary['average_sales']:.2f}")
    print(f"Total Profit: ${summary['total_profit']:.2f}")
    print("\nSales by region:")
    print(region_summary.to_string(index=False))
    print("\nSales by category:")
    print(category_summary.to_string(index=False))
    print(f"\nCharts saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
