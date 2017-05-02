# coding:utf-8
from datetime import datetime, timedelta

from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
from pony.orm import db_session

from model import BikeLocation


app = Sanic()
CORS(app)


@app.route("/bike/mobike")
@db_session
def home(request):
    print(request.args)
    time_range = request.args.get('timeRange')
    time = datetime.strptime(time_range, "%Y-%m-%d %H:%M")
    print(time)
    locations = BikeLocation.select(lambda l: l.time >= time and l.time <time+timedelta(minutes=10))
    ret = [{
        'longitude': item.x,
        'latitude': item.y
    } for item in locations]
    return json(ret)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='12345', debug=True)
