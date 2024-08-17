#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Doctor, Review

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/doctors')
def listdoctors():
        doctors = [doctor.to_dict() for doctor in Doctor.query.all()]
        return make_response(doctors, 200)

@app.route('/reviews/<int:id>')
def listreviews(id):
     reviews = [review.to_dict() for review in Review.query.filter(Review.doctor_id == id).all()]
     print(reviews)
     return make_response(reviews, 200)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

