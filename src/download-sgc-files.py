import mysql.connector
import os

# MySQL connection parameters
mysql_config = {
    'host': '172.16.0.6',
    'user': 'root',
    'password': '*4b0g4d0s4s*',
    'database': 'userscyc'
}

# Directory to save downloaded files
download_directory = './sgc-files'

# Create a connection to MySQL
conn = mysql.connector.connect(**mysql_config)
cursor = conn.cursor()

# SQL query to select the BLOB data and file names
query = "SELECT nombre, archivo, tipo_documento FROM documentos_sgc"

cursor.execute(query)

# Fetch all rows from the table
rows = cursor.fetchall()

# Dictionary to map tipo_documento values to file extensions
extension_map = {
    1: '.pdf',
    2: '.xlsx'
    # Add more mappings if there are additional file types
}

char_mapping = {
    'Á': 'A',
    'É': 'E',
    'Í': 'I',
    'Ó': 'O',
    'Ú': 'U',
    'Ñ': 'N'
    # Add more characters as needed
}

def clean_file_name(file_name):
    cleaned_name = ''.join(char_mapping.get(c, c) for c in file_name)
    return cleaned_name

# Loop through the rows and save the files
for row in rows:
    file_name_raw = row[0]

    # Replace characters that can't be encoded with an underscore
    file_name_cleaned = clean_file_name(file_name_raw)


    blob_data = row[1]  # Assuming the BLOB data is in the second column
    tipo_documento = row[2]  # Assuming tipo_documento is in the third column

    # Get the file extension based on tipo_documento value
    file_extension = extension_map.get(tipo_documento, '')

    # Create a file path for saving the file with the appropriate extension
    file_path = os.path.join(download_directory, f"{file_name_cleaned}{file_extension}")

    # Write the BLOB data to a file
    with open(file_path, 'wb') as file:
        file.write(blob_data)

# Close cursor and connection
cursor.close()
conn.close()