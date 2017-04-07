# coding:utf-8
import asyncio
import logging
import async_timeout

import aiohttp
import uvloop
import numpy as np

from model import BikeLocation
from proxy import ProxyPool


logging.basicConfig(format='%(levelname)s %(asctime)s %(funcName)s : %(message)s', level=logging.DEBUG)
logger = logging.getLogger('crawler')

sema = None


class City:

    def __init__(self, city, left, top, right, bottom):
        self.city = city
        self.left = left
        self.right = right
        self.top = top
        self.bottom = bottom


class Crawler:

    headers = {
        'charset': "utf-8",
        'platform': "4",
        "referer": "https://servicewechat.com/wx40f112341ae33edb/1/",
        'content-type': "application/x-www-form-urlencoded",
        'user-agent': "MicroMessenger/6.5.4.1000 NetType/WIFI Language/zh_CN",
        'host': "mwx.mobike.com",
        'connection': "Keep-Alive",
        'accept-encoding': "gzip",
        'cache-control': "no-cache"
    }

    mobike_url = "https://mwx.mobike.com/mobike-api/rent/nearbyBikesInfo.do"
    data_format = "latitude={}&longitude={}&errMsg=getMapCenterLocation"

    left = 30.7828453209
    top = 103.9213455517
    right = 30.4781772402
    bottom = 104.2178123382
    offset = 0.002

    def __init__(self, loop):
        self.loop = loop
        self.proxy_pool = ProxyPool(loop)

    async def get_bike(self, lat, lon):
        print("get_bike")
        proxy = self.proxy_pool.pick()
        async with sema:
            with async_timeout.timeout(2, loop=self.loop):
                try:
                    async with aiohttp.request(
                            method='POST',
                            url=self.mobike_url,
                            headers=self.headers,
                            data=self.data_format.format(lat, lon),
                            proxy=proxy.url,
                    ) as resp:
                        ret = await resp.json()
                        if ret:
                            logger.info("success proxy: %s", proxy.url)
                            self.save(ret)
                except Exception as e:
                    proxy.error()
                    logger.error("get bike error: %s, lat: %s, lon: %s", str(e), str(lat), str(lon))
            sema.release()

    def save(self, ret):
        for item in ret['object']:
            BikeLocation.new_location(item)

    async def run(self):
        logger.info("start")
        total = 1
        lat_range = np.arange(self.left, self.right, -self.offset)
        future_list = []
        for lat in lat_range:
            lon_range = np.arange(self.top, self.bottom, self.offset)
            for lon in lon_range:
                total += 1
                future_list.append(asyncio.Task(self.get_bike(lat, lon)))
        for task in future_list:
            await task
        logger.info("get %s", str(total))
        logger.info("done")


def init_config():
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())


def run():
    init_config()
    loop = asyncio.get_event_loop()
    global sema
    sema = asyncio.Semaphore(200, loop=loop)
    crawler = Crawler(loop)
    loop.run_until_complete(crawler.run())

if __name__ == '__main__':
    run()
