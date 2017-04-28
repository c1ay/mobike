# coding:utf-8
from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
from random import choice


app = Sanic()
CORS(app)


@app.route("/")
def home(request):
    print(request.args)
    time_range = request.args.get('timeRange')
    lon = 104.0993
    lat = 30.64511
    lon1 = 103.93
    lat1 = 30.55
    ret = {
        'longitude': choice([lon, lon1]),
        'latitude': choice([lat, lat1]),
    }
    return json(ret)


if __name__ == '__main__':
    app.run(port='12345', debug=True)
