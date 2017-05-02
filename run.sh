#!/bin/bash
while true; do
    git pull
    echo "Started"
    python3.5 crawler.py > /dev/null
    echo "done"
done
