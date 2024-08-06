bind = "127.0.0.1:8001"
workers = 4  # Adjust based on your CPU cores
threads = 2  # Adjust based on the load
timeout = 30

# Optional: additional settings
errorlog = '/var/www/INSIGHTS/INSIGHTSAPI/utils/logs/exceptions.log'
loglevel = 'warning'
preload_app = True
