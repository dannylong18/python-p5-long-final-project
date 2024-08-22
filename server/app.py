#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Doctor, Review

# Views go here!

@app.route('/', methods=['POST'])
def index():
    return '<h1>Project Server</h1>'

@app.route('/login', methods=['POST'])
def login():

    if request.method == 'POST':

        data = request.json
        username = data.get('username')

        user = User.query.filter(User.username == username).first()

        if user:
            session['user_id'] = user.id
            return make_response({'Success': 'User logged in!'}, 201)
        
        return {'Error': 'Username is incorrect or does not exist. Please try again.'}, 401

@app.route('/signup', methods=['POST'])
def signup():
     
     if request.method == 'POST':
        data = request.json

        name = data.get('name')
        age = data.get('age')
        username = data.get('username')

        if not name or not age or not username:
            return make_response({"Error": "Missing required fields"}, 400)
        
        if User.query.filter(User.username==username).first():
             return make_response({"Error": "Username taken. Please try again."}, 400)
        
        if not (18 <= age <= 90):
            return make_response({"Error": "Age must be an integer between 18 and 90"}, 400)

        new_user = User(
             name = name,
             age = age,
             username = username
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return make_response({"Error": "Please try again."}, 400)


        session['user_id'] = new_user.id

        return make_response({"Message": "User successfully created!"}, 201)
     

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

        if not (0 <= rating <= 5):
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

