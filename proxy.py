# coding:utf-8
import random

import requests


class Proxy:

    def __init__(self, url):
        self.url = url
        self.rank_score = 0

    def used(self):
        self.rank_score += 2

    def error(self):
        self.rank_score -= 15

    def __str__(self):
        return '<{}, score:{}>'.format(self.url, self.rank_score)

    def __repr__(self):
        return '<{}, score:{}>'.format(self.url, self.rank_score)


class ProxyPool:

    def __init__(self, loop):
        self.loop = loop
        self.proxies = []
        self._get_new_proxy()

    def _get_new_proxy(self):
        res = requests.get('http://proxy:8000/proxy?protocol=0')
        ret = res.json()
        self.proxies = list(map(lambda p: Proxy(p), ret))

    def pick(self):
        self.proxies.sort(key=lambda item: item.rank_score)
        proxy = random.choice(self.proxies[:30])
        proxy.used()
        return proxy
