import smtplib
from email.mime.text import MIMEText
from email.header import Header
from datetime import datetime, timedelta
import random
import os
import sys
import string

class Verifier:
    def __init__(self):
        self.__verifiable_users = {}
        self.__email = ''
        self.__password = ''


    def __clear_users(self):
        deletable = []
        for key in self.__verifiable_users.keys():
            if datetime.now()-self.__verifiable_users[key][0]>timedelta(minutes=5):
                deletable.append(key)
        for one in deletable:
            del self.__verifiable_users[one]


    def add_verifiable_user(self, email, username, data=None):
        self.__clear_users()
        verification_code = ''.join(random.choice(string.digits) for i in range(5))
        self.__verifiable_users[email] = (datetime.now(), verification_code, username, data)

        body = open(os.path.join(os.path.dirname(__file__), 'email.html'), 'r').read()
        body = body.replace('MY_SUPER_CODE', verification_code)
        body = body.replace('MY_SUPER_USERNAME', username)
        msg = MIMEText(body, 'html', 'utf-8')

        msg['Subject'] = Header('Код підтвердження зміни паролю', 'utf-8')
        msg['From'] = 'Rateyard <%s>' % self.__email
        msg['To'] = email

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(self.__email, self.__password)
        server.sendmail(self.__email, email, msg.as_string())
        server.quit()


    def get_users(self):
        return self.__verifiable_users


    def verify(self, email, code):
        self.__clear_users()
        user_data = self.__verifiable_users.get(email)
        if user_data is None or user_data[1]!=code: return None
        del self.__verifiable_users[email]
        return (user_data[2], user_data[3])