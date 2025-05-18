FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

RUN mkdir -p app/uploads/images app/uploads/videos app/uploads/thumbnails
RUN chmod -R 777 app/uploads

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.main:app"]
