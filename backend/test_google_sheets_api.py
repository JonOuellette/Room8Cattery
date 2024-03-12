import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

def initialize_google_sheets():
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    service_account_file = os.path.join(os.getcwd(), 'config', 'room8cattery-397dd6b798b8.json')

    credentials = Credentials.from_service_account_file(
        service_account_file, scopes=scopes)
    service = build('sheets', 'v4', credentials=credentials)
    return service.spreadsheets()

def main():
    spreadsheet_id = '1g3ZoPFgyB7uEeYFu446DlRj3ITIkKpy1SMgUNXPMrBI'  # Google Sheet ID
    range_name = 'Cats!A1:E'  # Adjust the range based on your needs
    sheets = initialize_google_sheets()
    result = sheets.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        print('Name, Major:')  # Update this if different headings are used
        for row in values:
            # Check if the row has at least 2 elements
            if len(row) >= 2:
                # Adjust indices according to your data's structure
                print(f"{row[0]}, {row[1]}")
            else:
                print("Row has fewer than 2 elements, skipping.")


if __name__ == '__main__':
    main()
