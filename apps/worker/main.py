from celery import Celery
import os

redis_url = os.environ.get("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "docuai_worker",
    broker=redis_url,
    backend=redis_url,
)

celery_app.conf.task_routes = {
    'tasks.ocr.*': {'queue': 'ocr_queue'},
    'tasks.extraction.*': {'queue': 'extraction_queue'},
    'tasks.validation.*': {'queue': 'validation_queue'},
    'tasks.generation.*': {'queue': 'generation_queue'},
}

@celery_app.task
def health_check():
    return "ok"
