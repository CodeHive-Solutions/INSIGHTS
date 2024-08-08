import os
from locust import HttpUser, task, constant, between, c
from dotenv import load_dotenv


ENV_PATH = "/var/env/INSIGHTS.env"

if not os.path.isfile(ENV_PATH):
    raise FileNotFoundError("The env file was not found.")

load_dotenv(ENV_PATH)


class BasicUser(HttpUser):
    wait_time = constant(0.2)
    # wait_time = between(0.2, 1)
    host = "https://insights-api-dev.cyc-bpo.com"

    # @task(1)
    def get_holy_days(self):
        with self.client.get(
            "/services/holidays/2024/", catch_response=True
        ) as response:
            if response.elapsed.total_seconds() > 0.5:
                response.failure("Request took too long")

    @task
    def get_sgc_files(self):
        with self.client.get("/sgc/", catch_response=True) as response:
            if response.elapsed.total_seconds() > 2:
                response.failure("Request took too long")

    def on_start(self):
        self.client.post(
            "/token/obtain/",
            json={"username": "staffnet", "password": os.environ["StaffNetLDAP"]},
            catch_response=True,
        )
