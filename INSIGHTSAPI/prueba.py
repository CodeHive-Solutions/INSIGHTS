# from ldap3 import Server, Connection, SAFE_SYNC, SUBTREE
# import os
# from dotenv import load_dotenv

# if not os.path.isfile('/var/env/INSIGHTS.env'):
#     raise FileNotFoundError('The env file was not found.')

# load_dotenv("/var/env/INSIGHTS.env")
# ldap_server_uri = "ldap://CYC-SERVICES.COM.CO:389"
# bind_dn = "CN=StaffNet,OU=TECNOLOGIA,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO"  # The LDAP user to bind with for authentication
# bind_password = os.getenv("Adminldap")  # Password for the bind user
# # bind_password = 'Password1'  # Password for the bind user

# # Create the LDAP server object
# server = Server(ldap_server_uri)


# conn = Connection(server, user=bind_dn, password=bind_password, auto_bind=True) #type: ignore
# # If the bind is successful, the connection is established
# if conn.bound:
#     print("LDAP connection successful!")
# else:
#     print("LDAP connection failed!")
# # Now, let's perform a simple search to list some entries
# search_base = 'dc=CYC-SERVICES,dc=COM,dc=CO'  # Start search at the root
# # Define the LDAP filter to list objects
# ldap_filter = f"(sAMAccountName={'Staffnet'})"
# # Perform the LDAP search
# search_result = conn.search(search_base, ldap_filter, search_scope=SUBTREE, attributes=["*"])

# # Check if the search was successful
# if not search_result:
#     print("No users found.")
# else:
#     print("Users Found:")
#     for entry in conn.entries:
#         print(entry)
#         # Access LDAP attributes of each entry
#         cn = entry.sAMAccountName.value
#         given_name = entry.name.value
#         # last_name = entry.sn.value
#         # email = entry.mail.value

#         print(f"Username (cn): {cn}")
#         print(f"First Name (givenName): {given_name}")
#         # print(f"Last Name (sn): {last_name}")
#         # print(f"Email (mail): {email}")
#         print("===================")
# # Don't forget to unbind the connection when you're done
# conn.unbind()