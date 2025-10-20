FROM python:3.13-slim

# set work directory
WORKDIR /pam-app/backend

# set environment variables for python outputs to show up in the console and no bytecode files are generated
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .

# Install system dependencies required for GeoDjango, including compilation dependencies and geospatial libraries
RUN apt-get update && \
    apt-get install -y gdal-bin proj-bin libgeos-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project to project backend
COPY . .

EXPOSE 8000

# Make db script executable
RUN chmod +x /pam-app/backend/wait-for-db.sh

# Run database check first, then run app.
ENTRYPOINT [ "/pam-app/backend/wait-for-db.sh" ]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "backend.wsgi:application"]