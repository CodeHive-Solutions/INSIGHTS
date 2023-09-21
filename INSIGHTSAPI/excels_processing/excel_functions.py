import pandas as pd
from typing import BinaryIO
import logging

logger = logging.getLogger(__name__)

def upload_df_to_table(df:pd.DataFrame, connection, table_name: str, columns_mapping: dict[str, str]) -> bool:
    """
    Upload data from a Pandas DataFrame to a specified database table.

    Parameters:
    - df (pd.DataFrame): The DataFrame containing the data to be uploaded.
    - connection: The database connection to execute SQL queries.
    - table_name (str): The name of the database table where data will be inserted.
    - columns_mapping (dict): A dictionary that maps DataFrame column names to destination column names in the database table.

    Returns:
    - bool: True if the upload was successful, False if an error occurred.
    """
    try:
        # Create a list of dictionaries where each dictionary represents a row
        data_dicts = []
        for index, row in df.iterrows():
            data_dict = {}
            for excel_column, destination_column in columns_mapping.items():
                if excel_column in df.columns:
                    data_dict[destination_column] = row[excel_column]
            data_dicts.append(data_dict)

        # Create the INSERT query dynamically based on columns_mapping
        columns = ', '.join(data_dicts[0].keys())
        values_template = ', '.join(['%s'] * len(data_dicts[0]))
        query = f"INSERT IGNORE INTO {table_name} ({columns}) VALUES ({values_template})"
        cursor = connection.cursor()
        # Execute the query using executemany with the list of dictionaries
        cursor.executemany(query, [tuple(d.values()) for d in data_dicts])
        # Commit the transaction to save changes
        connection.commit()
        return True
    except Exception as e:
        logger.exception(e)
        return False


def file_to_data_frame(file: BinaryIO) -> pd.DataFrame:
    """
    Read data from an Excel file and return it as a pandas DataFrame.

    Parameters:
    - file (BinaryIO): The Excel file to be read.

    Returns:
    - pd.DataFrame: A DataFrame containing the Excel data with columns as specified in columns_mapping.

    Example usage:

    file = open('example.xlsx', 'rb')  # Replace 'example.xlsx' with the path to your Excel file

    data_frame = read_excel(file)

    print(data_frame)
    """
    try:
        df = pd.read_excel(file)
        return df
    except Exception as e:
        raise ValueError(f"Error reading Excel file: {str(e)}")