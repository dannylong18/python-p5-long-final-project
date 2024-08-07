from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    pass
class Doctor(db.Model, SerializerMixin):
    pass
class Review(db.Model, SerializerMixin):
    pass