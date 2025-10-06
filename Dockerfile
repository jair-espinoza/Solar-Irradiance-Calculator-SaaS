# python image
FROM python:3.11-slim

# env varaiables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# work dir
WORKDIR /app

# cpy requirments
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Project
COPY . /app/

# Port 5001
EXPOSE 5001

# Set Flask env variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

# Run
CMD ["flask", "run"]