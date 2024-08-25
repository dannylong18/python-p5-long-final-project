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

@app.route('/checksession')
def checksession():
    user = User.query.filter(User.id == session.get('user_id')).first()
    if user:
        user = user.to_dict()
        return make_response(user, 200)
    else:
        return {'Message': '401: Not Authorized'}, 401

@app.route('/login', methods=['POST'])
def login():

    if request.method == 'POST':

        data = request.json
        username = data.get('username')

        user = User.query.filter(User.username == username).first()

        if user:
            session['user_id'] = user.id
            user = user.to_dict()
            return make_response(user, 201)
        
        return {'Error': 'Username is incorrect or does not exist. Please try again.'}, 401

@app.route('/logout', methods=['DELETE'])
def logout():
    if request.method == 'DELETE':
        session['user_id'] = None
        return {'Message': 'User logged out!'}, 200


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
        new_user = new_user.to_dict()
        return make_response(new_user, 201)

@app.route('/doctors')
def listdoctors():
        doctors = [doctor.to_dict() for doctor in Doctor.query.all()]
        return make_response(doctors, 200)

@app.route('/users')
def listusers():
    users = [user.to_dict() for user in User.query.all()]
    return make_response(users, 200)

@app.route('/reviews/<int:id>')
def listreviews(id):
     reviews = [review.to_dict() for review in Review.query.filter(Review.doctor_id == id).all()]
     return make_response(reviews, 200)

@app.route('/createreview', methods=['GET','POST'])
def create_review():
     user_id = session.get('user_id')

     if not user_id or not User.query.filter(User.id == user_id).first():
         return make_response({'Error': 'Unauthorized. Please login or create an account'}, 401)
     
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
             doctor_id = doctor_id,
             user_id = user_id
        )

        db.session.add(new_review)
        db.session.commit()

        new_review_dict = new_review.to_dict()
        return make_response(new_review_dict, 201)
      
@app.route('/reviews/<int:review_id>', methods = ['PATCH', 'DELETE'])
def modify_review(review_id):
    user_id = session.get('user_id')
    if not user_id:
        return make_response({'Error': 'Unauthorized'}, 401)
    
    review = Review.query.get(review_id)
    if not review:
        return make_response({'Error': 'Review not found'}, 404)
    
    if review.user_id != user_id:
        return make_response({'Error': 'Forbidden'}, 403)

    if request.method == 'PATCH':
        data = request.json
        if 'comment' in data:
            review.comment = data['comment']
        if 'rating' in data:
            rating = data['rating']
            if not (0 <= rating <= 5):
                return make_response({'Error': 'Rating must be between 0 and 5'}, 400)
            review.rating = rating

        db.session.add(review)
        db.session.commit()

        review = review.to_dict()
        return make_response(review, 200)
    
    if request.method == 'DELETE':
        db.session.delete(review)
        db.session.commit()
        return make_response({'Message': 'Review successfully deleted'}, 200)
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)

