from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns

matplotlib.use("Agg")


def plot_sales_by_region(df, output_path):
    """Create bar chart for sales by region."""
    if "region" not in df.columns or "sales" not in df.columns:
        raise ValueError("Dataset must contain 'region' and 'sales' columns.")

    region_summary = df.groupby("region")["sales"].sum().sort_values(ascending=False)

    plt.figure(figsize=(8, 5))
    sns.barplot(x=region_summary.index, y=region_summary.values, hue=region_summary.index, dodge=False, legend=False, palette="viridis")
    plt.title("Total Sales by Region")
    plt.xlabel("Region")
    plt.ylabel("Sales")
    plt.xticks(rotation=20)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def plot_sales_distribution(df, output_path):
    """Create histogram of sales values."""
    if "sales" not in df.columns:
        raise ValueError("Dataset must contain a 'sales' column.")

    plt.figure(figsize=(8, 5))
    sns.histplot(df["sales"], bins=10, kde=True, color="steelblue")
    plt.title("Sales Distribution")
    plt.xlabel("Sales")
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def plot_category_summary(df, output_path):
    """Create bar chart for sales by category."""
    if "category" not in df.columns or "sales" not in df.columns:
        raise ValueError("Dataset must contain 'category' and 'sales' columns.")

    category_summary = df.groupby("category")["sales"].sum().sort_values(ascending=False)

    plt.figure(figsize=(8, 5))
    sns.barplot(x=category_summary.index, y=category_summary.values, hue=category_summary.index, dodge=False, legend=False, palette="magma")
    plt.title("Total Sales by Category")
    plt.xlabel("Category")
    plt.ylabel("Sales")
    plt.xticks(rotation=15)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()
