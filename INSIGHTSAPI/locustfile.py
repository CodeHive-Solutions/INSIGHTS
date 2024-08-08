import os
from locust import HttpUser, task, constant, between
from dotenv import load_dotenv


ENV_PATH = "/var/env/INSIGHTS.env"

if not os.path.isfile(ENV_PATH):
    raise FileNotFoundError("The env file was not found.")

load_dotenv(ENV_PATH)


class HelloWorldUser(HttpUser):
    # wait_time = constant(0.5)
    # wait_time = between(0.2, 1)
    host = "https://insights-api-dev.cyc-bpo.com"

    @task(1)
    def hello_world(self):
        with self.client.get(
            "/services/holidays/2024/", catch_response=True
        ) as response:
            if response.elapsed.total_seconds() > 0.5:
                response.failure("Request took too long")

    @task(5)
    def get_sgc_files(self):
        with self.client.get("/sgc/", catch_response=True) as response:
            if response.elapsed.total_seconds() > 1:
                response.failure("Request took too long")

    def on_start(self):
        self.client.post(
            "/token/obtain/",
            json={"username": "staffnet", "password": os.environ["StaffNetLDAP"]},
        )
