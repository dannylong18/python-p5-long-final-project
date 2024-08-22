from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-reviews.users',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String, nullable=False, unique=True)

    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')
    doctors = association_proxy('reviews', 'doctor', creator=lambda doctor_obj: Review(doctor = doctor_obj))
    
class Doctor(db.Model, SerializerMixin):
    __tablename__ = 'doctors'

    serialize_rules = ('-reviews.doctors',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    specialty = db.Column(db.String)
    bio = db.Column(db.String)

    reviews = db.relationship('Review', back_populates='doctor', cascade='all, delete-orphan')
    users = association_proxy('reviews', 'user', creator=lambda user_obj: Review(user = user_obj))

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    serialize_rules = ('-user.reviews', '-doctor.reviews',)

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String)
    time_created = db.Column(db.DateTime, server_default=db.func.now())
    time_updated = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))

    user = db.relationship('User', back_populates='reviews')
    doctor = db.relationship('Doctor', back_populates='reviews')