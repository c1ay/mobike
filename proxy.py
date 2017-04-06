# coding:utf-8
import random

import requests

class Proxy:

    def __init__(self, url):
        self.url = url
        self.rank_score = 0

    def used(self):
        self.rank_score += 1

    def error(self):
        self.rank_score -= 10


class ProxyPool:

    proxy_url = "https://jsonblob.com/api/jsonBlob/31bf2dc8-00e6-11e7-a0ba-e39b7fdbe78b"

    def __init__(self, loop):
        self.loop = loop
        self.proxies = []
        self._get_new_proxy()
        # self.loop.create_task(self._get_new_proxy())

    def _get_new_proxy(self):
        resp = requests.get(self.proxy_url, timeout=10)
        proxy = resp.json()
        self.proxies = list(map(lambda item: Proxy(item), proxy))
        #  res = requests.get('http://:8000/?types=0&count=5&country=国内&count=100')
        #  ret = res.json()
        #  self.proxies = list(map(lambda p: Proxy(url="http://{}:{}".format(p[0], p[1])), ret))

    def pick(self):
        self.proxies.sort(key=lambda item: item.rank_score, reverse=True)
        proxy = random.choice(self.proxies[:50])
        proxy.used()
        return proxy
