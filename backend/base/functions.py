import os.path
from email.mime.text import MIMEText

from google.oauth2 import service_account

import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def send_mail_google():
    
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    creds = flow.run_local_server (
        access_type='offline',
        prompt=None,
        login_hint='martindeinnocentiis90@gmail.com',
    )
    
    service = build ('gmail', 'v1', credentials=creds)
    
    message = MIMEText ('Mensaje de prueba')
    message['to']='martindeinnocentiis90@gmail.com'
    message['subject']='API TESTING'
    create_message = {'raw': base64.urlsafe_b64decode(message.as_bytes()).decode()}
    
    try: 
        message = (service.users().messages().send(userId="me", body=create_message).execute())
        
        print (f'message sent')
        
    except HttpError as e:
        print (f'!!!!!!!!!!!!!!!AN ERRROR OCCURED!!!!!!!!!!!!:{e}')
        message = None
        
