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

    def __init__(self, loop):
        self.loop = loop
        self.proxies = []
        self._get_new_proxy()

    def _get_new_proxy(self):
        res = requests.get('http://proxy:8000/?types=0&count=500')
        ret = res.json()
        self.proxies = list(map(lambda p: Proxy(url="http://{}:{}".format(p[0], p[1])), ret))

    def pick(self):
        self.proxies.sort(key=lambda item: item.rank_score, reverse=True)
        proxy = random.choice(self.proxies[:50])
        proxy.used()
        return proxy
