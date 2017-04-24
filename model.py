# coding:utf-8
import logging
from datetime import datetime

from pony.orm import Database, Required, db_session

db = Database()
db.bind('sqlite', 'bike.sqlite', create_db=True)
logger = logging.getLogger('model')


class BikeLocation(db.Entity):

    dist_id = Required(int)
    dist_num = Required(int)
    bike_id = Required(str, 16)
    bike_type = Required(int)
    x = Required(str, 32)
    y = Required(str, 32)
    time = Required(datetime)
    type = Required(int)

    @classmethod
    @db_session
    def new_location(cls, ret):
        logger.info("new %s", str(ret))
        cls(
            bike_id=ret['bikeIds'],
            bike_type=ret['biketype'],
            dist_id=ret['distId'],
            dist_num=ret['distNum'],
            x=str(ret['distX']),
            y=str(ret['distY']),
            time=datetime.now(),
            type=ret['type'],
        )


db.generate_mapping(create_tables=True)
