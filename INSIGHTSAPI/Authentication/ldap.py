from django.contrib.auth.backends import BaseBackend
from ldap3 import Server, Connection, SAFE_SYNC, SUBTREE
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed


class LDAPBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        server = Server('CYC-SERVICES.COM.CO')
        conn = Connection(server, user='Staffnet', password='T3cn0l0g142023*', client_strategy=SAFE_SYNC, auto_bind=True)
        _,_,response,_ = conn.search('dc=CYC-SERVICES,dc=COM,dc=CO', '(sAMAccountName=%s)' % username, search_scope=SUBTREE)
        if "raw_dn" in response[0]:
            print("TRUEEEEEEEEEEEEE")
            try:
                raw_dn = response[0]["raw_dn"]
                cn = raw_dn.decode("utf-8").split(",")[0].split("=")[1]
                login = Connection(server, user=cn, password=password, client_strategy='SYNC', auto_bind=True, read_only=True)
                login.unbind()
                return {"username": username}
            except Exception as e:
                print(e)
        else:
            error = {"error":"Usuario no encontrado"}
            return None