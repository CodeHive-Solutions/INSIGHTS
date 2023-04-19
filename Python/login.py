from ldap3 import Server, Connection, SAFE_SYNC,  SUBTREE

# LDAP
server = Server('CYC-SERVICES.COM.CO')


def start_ldap():
    # Conexion a LDAP mediante usuario ADMIN
    conn = Connection(server, user='Staffnet', password='T3cn0l0g142023*',
                      client_strategy=SAFE_SYNC, auto_bind=True)
    return conn, server


def consulta_login(body, conexion):
    cursor = conexion.cursor()
    password = body['password']
    user = body['user']
    query = "SELECT permission_consult, permission_create, permission_edit, permission_disable, permission_create_admins FROM users WHERE `user` = %s"
    # La coma de user si es necesaria
    cursor.execute(query, (user,))
    result_query = cursor.fetchone()
    if result_query != None and result_query != []:
        status, result, response, _ = consulta_usuario_ad(user, 'name')
        if len(response) >= 4:
            # Login
            atributos = response[0]['attributes']
            nombre = atributos['name']
            try:
                login = Connection(
                    server, user=nombre, password=password, client_strategy='SYNC', auto_bind=True, read_only=True)
                response = {"disable": result_query[3], "edit": result_query[2], 'status': 'success', "consult": result_query[0], "create": result_query[1],
                            'create_admins': result_query[4]}
                login.unbind()
            except:
                response = {'status': 'failure',
                            'error': 'Contraseña Incorrecta'}
        else:
            response = {'status': 'failure',
                        'error': 'usuario no encontrado'}
    else:
        response = {'status': 'failure',
                    'error': 'usuario no encontrado'}
    cursor.close()
    return response

def consulta_usuario_ad(user, attributes):
    conn, server = start_ldap()
    # Busqueda del usuario
    status, result, response, _ = conn.search(
        'dc=CYC-SERVICES,dc=COM,dc=CO', '(sAMAccountName=%s)' % (user), search_scope=SUBTREE,  attributes=attributes)
    return status, result, response, _
