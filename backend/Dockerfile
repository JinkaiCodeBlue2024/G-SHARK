FROM python:3.11

WORKDIR /src
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080" ]
