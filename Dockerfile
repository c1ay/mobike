FROM python:3.5-alpine
COPY . /src
WORKDIR /src
RUN pip3 install --no-cache-dir -r requirments.txt
CMD ["sh", "run.sh"]