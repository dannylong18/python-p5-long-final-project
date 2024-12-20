#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, url_for, redirect
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
import stripe
import traceback
import stripe.error

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Doctor, Review, StripePayment

stripe.api_key = 'sk_test_51Q84OoHti3OJEVYB8aAlZ5R60xvdLxqApTPkAin6NWvqNugT7Iy13kN5Ixbl9orcGPCprvKE9pQ52XkOQdMQvkFK00ElC3xMys'
# Views go here!

class Payment(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id or not User.query.filter(User.id == user_id).first():
            return make_response({"Error": "Unauthorized. Please login or create an account to make a payment."}, 401)
        
        try:
            data = request.get_json()
            amount = data.get('amount')
            
            if not amount or amount <= 0:
                return make_response({'Error': 'Invalid Amount'}, 400)
            
            print("Creating Stripe Checkout session...")
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Custom Payment",
                        },
                        "unit_amount": int(amount * 100),
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url='http://localhost:3000/payment_success',
                cancel_url='http://localhost:3000/payment_fail',
            )

            transaction = StripePayment(
                amount=int(amount),
                method='credit card',
                user_id=user_id
                )

            db.session.add(transaction)
            db.session.commit()
            
            return make_response({'session_id': checkout_session.id}, 200)
        
        except stripe.error.StripeError as e:
            print(f"Stripe error occurred: {e}")
            return make_response({'error': str(e)}, 500)
        except Exception as e:
            print(f"General error occurred: {str(e)}")
            print("Stack trace:")
            print(traceback.format_exc())
            return make_response({'error': 'Something went wrong, please try again'}, 500)

api.add_resource(Payment, '/payment')

class Index(Resource):
    def get(self):
        return '<h1>Project Server</h1>'

api.add_resource(Index, '/')

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            user = user.to_dict()
            return make_response(user, 200)
        else:
            return {'Message': '401: Not Authorized'}, 401
        
api.add_resource(CheckSession, '/checksession', endpoint='checksession')

class Login(Resource):
    def post(self):
        data = request.json
        username = data.get('username')

        user = User.query.filter(User.username == username).first()

        if user:
            session['user_id'] = user.id
            user = user.to_dict()
            return make_response(user, 201)
        
        return {'Error': 'Username is incorrect or does not exist. Please try again.'}, 401
    
api.add_resource(Login, '/login', endpoint='login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'Message': 'User logged out!'}, 200

api.add_resource(Logout, '/logout', endpoint='logout')

class Signup(Resource):
     def post(self):

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

api.add_resource(Signup, '/signup', endpoint='signup')

class ListDoctors(Resource):
        def get(self):
            doctors = [doctor.to_dict() for doctor in Doctor.query.all()]
            return make_response(doctors, 200)

api.add_resource(ListDoctors, '/doctors', endpoint='doctors')

class CreateDoctor(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id or not User.query.filter(User.id == user_id).first():
            return make_response({"Error": "Unauthorized. Please login or create an account."}, 401)
        
        data = request.json
        name = data.get('name')
        specialty = data.get('specialty')
        bio = data.get('bio')

        if not name:
            return make_response({'Error': 'Name is required.'})
        
        new_doc = Doctor(
            name = name,
            specialty = specialty,
            bio = bio
        )

        db.session.add(new_doc)
        db.session.commit()

        new_doc_dict = new_doc.to_dict()
        return make_response(new_doc_dict, 201)
    
api.add_resource(CreateDoctor, '/createdoctor', endpoint='createdoctor')

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

api.add_resource(Users, '/users', endpoint='users')

class ListReviews(Resource):
     def get(self, id):
        reviews = [review.to_dict() for review in Review.query.filter(Review.doctor_id == id).all()]
        return make_response(reviews, 200)

api.add_resource(ListReviews, '/reviews/<int:id>', endpoint='reviews/<int:id>')

class CreateReview(Resource):
     def post(self):
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
      
api.add_resource(CreateReview, '/createreview', endpoint='createreview')

class ModifyReview(Resource):
    def patch(self, review_id):
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
    
    def delete(self, review_id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'Error': 'Unauthorized'}, 401)
        
        review = Review.query.get(review_id)
        if not review:
            return make_response({'Error': 'Review not found'}, 404)
        
        if review.user_id != user_id:
            return make_response({'Error': 'Forbidden'}, 403)
        
        db.session.delete(review)
        db.session.commit()
        return make_response({'Message': 'Review successfully deleted'}, 200)

api.add_resource(ModifyReview, '/reviews/<int:review_id>', endpoint='modifyreview')

class FilterDoctors (Resource):
    def get (self, user_id, specialty):
        # user_id = session.get('user_id')

        # if not user_id: 
        #     return make_response ({"Error": "User must be logged in"})
        
        user = User.query.filter(User.id == user_id).first()
        user_docs = user.doctors
        doc = [doc.to_dict(rules = '') for doc in user_docs if doc.specialty == specialty]
        return make_response (doc, 200)
        # reviews = [r for r in Review.query.filter(Review.user_id == user_id).all()]
        # for review in reviews:
            

api.add_resource(FilterDoctors, '/filter_doctors/<int:user_id>/<string:specialty>', endpoint='filter_doctors')

if __name__ == '__main__':
    app.run(port=5000, debug=True)

