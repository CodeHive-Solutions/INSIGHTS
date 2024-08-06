from locust import HttpUser, TaskSet, task, between

class UserBehavior(TaskSet):
    @task(1)
    def list_items(self):
        self.client.get("/services/holidays/2024/")

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    # wait_time = between(1, 5)
