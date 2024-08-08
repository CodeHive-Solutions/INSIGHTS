bind = "127.0.0.1:8001"
workers = 8
threads = 2  # Adjust based on the load
timeout = 30

worker_class = 'gthread'
threads = 4
errorlog = '/var/www/INSIGHTS/INSIGHTSAPI/utils/logs/exceptions.log'
loglevel = 'warning'
preload_app = True
