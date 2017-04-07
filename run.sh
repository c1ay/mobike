#!/bin/bash
while true; do
    git pull
    echo "Started"
    python3 crawler.py
done
