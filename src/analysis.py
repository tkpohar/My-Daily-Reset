import pandas as pd


def get_summary_statistics(df):
    """Return a concise summary of the dataset."""
    summary = {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "total_sales": round(float(df["sales"].sum()), 2) if "sales" in df.columns else 0,
        "average_sales": round(float(df["sales"].mean()), 2) if "sales" in df.columns else 0,
        "total_profit": round(float(df["profit"].sum()), 2) if "profit" in df.columns else 0,
    }
    return summary


def get_region_summary(df):
    """Aggregate sales by region."""
    if "region" not in df.columns or "sales" not in df.columns:
        return pd.DataFrame()

    return (
        df.groupby("region", as_index=False)["sales"]
        .sum()
        .sort_values("sales", ascending=False)
        .rename(columns={"sales": "total_sales"})
    )


def get_category_summary(df):
    """Aggregate sales by category."""
    if "category" not in df.columns or "sales" not in df.columns:
        return pd.DataFrame()

    return (
        df.groupby("category", as_index=False)["sales"]
        .sum()
        .sort_values("sales", ascending=False)
        .rename(columns={"sales": "total_sales"})
    )
