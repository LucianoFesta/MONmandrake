FROM python:3.11.5-alpine

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

RUN opentelemetry-bootstrap -a install

EXPOSE 8000

CMD ["opentelemetry-instrument","--traces_exporter","console,otlp","--metrics_exporter","console","--service_name","backpython","--exporter_otlp_endpoint","0.0.0.0:4317","uvicorn","main:app","--host","0.0.0.0","--port","8000","--reload"]
