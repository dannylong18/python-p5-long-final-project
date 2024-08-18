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
     return make_response(reviews, 200)

@app.route('/createreview', methods=['GET','POST'])
def create_review():
     
     if request.method == 'POST': 

        data = request.json
        doctor_id = data.get('doctorId')
        rating = data.get('rating')
        comment = data.get('comment')

        if not doctor_id or not rating or not comment:
            return make_response({"Error": "Missing required fields"}, 400)

        if 0 <= rating <= 5:
             return make_response({"Error": "Rating must be from 0 to 5"}, 400)
        
        new_review = Review(
             rating = rating,
             comment = comment,
             doctor_id = doctor_id
        )

        db.session.add(new_review)
        db.session.commit()

        new_review_dict = new_review.to_dict()
        return make_response(new_review_dict, 201)
      
     
if __name__ == '__main__':
    app.run(port=5000, debug=True)

