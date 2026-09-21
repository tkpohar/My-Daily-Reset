import pandas as pd


def load_dataset(file_path):
    """Load CSV data into a DataFrame."""
    return pd.read_csv(file_path)


def clean_dataset(df):
    """Clean and standardize a raw dataset for analysis."""
    df = df.copy()

    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    df = df.drop_duplicates()

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].astype(str).str.strip()

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    numeric_columns = [
        "sales",
        "quantity",
        "profit",
        "discount",
    ]

    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    for column in df.select_dtypes(include="number").columns:
        median_value = df[column].median()
        df[column] = df[column].fillna(median_value)

    for column in df.select_dtypes(include="object").columns:
        df[column] = df[column].replace({"nan": "Unknown", "None": "Unknown", "": "Unknown"})
        df[column] = df[column].fillna("Unknown")

    if "sales" in df.columns:
        df["sales"] = df["sales"].round(2)

    return df
