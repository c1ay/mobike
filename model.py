# coding:utf-8
import logging
from datetime import datetime

from pony.orm import Database, Required, Set, db_session, commit

db = Database()
db.bind('sqlite', 'bike.sqlite', create_db=True)
logger = logging.getLogger('model')


class MoBike(db.Entity):

    bike_id = Required(str, 12)
    bike_type = Required(int)
    location = Set('BikeLocation')
    create_time = Required(datetime)


class BikeLocation(db.Entity):

    dist_id = Required(int)
    dist_num = Required(int)
    x = Required(str, 32)
    y = Required(str, 32)
    time = Required(datetime)
    type = Required(int)
    mobike = Required(MoBike)

    @classmethod
    @db_session
    def new_location(cls, ret):
        logger.info("new %s", str(ret))
        bike = MoBike.get(bike_id=ret['bikeIds'])
        if not bike:
            bike = MoBike(bike_id=ret['bikeIds'], bike_type=ret['biketype'], create_time=datetime.now())
        commit()
        cls(dist_id=ret['distId'],
            dist_num=ret['distNum'],
            x=str(ret['distX']),
            y=str(ret['distY']),
            time=datetime.now(),
            type=ret['type'],
            mobike=bike)


db.generate_mapping(create_tables=True)
