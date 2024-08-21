#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Doctor, Review

if __name__ == '__main__':
    
    with app.app_context():
        
        print('Deleting records...')
        User.query.delete()
        Doctor.query.delete()
        Review.query.delete()

        fake = Faker()

        print("Starting seed...")
        # Seed code goes here!
        users = []

        for i in range(5):
            name = fake.first_name()
            age = fake.random_int(18,90)
            username = f'{name}{age}username'
            user = User(name=name, age=age, username=username)
            users.append(user)
        
        db.session.add_all(users)
        db.session.commit()

        doctors = []

        d1 = Doctor(name = 'Dr. ' + fake.last_name(), specialty = 'Neurosurgery', bio = fake.paragraph(nb_sentences=3))
        d2 = Doctor(name = 'Dr. ' + fake.last_name(), specialty = 'Orthopedics', bio = fake.paragraph(nb_sentences=3))
        d3 = Doctor(name = 'Dr. ' + fake.last_name(), specialty = 'General Surgery', bio = fake.paragraph(nb_sentences=3))

        doctors.append(d1)
        doctors.append(d2)
        doctors.append(d3)

        db.session.add_all(doctors)
        db.session.commit()

        reviews = []

        for i in range(4):
            rating = fake.random_int(1,5)
            comment = fake.paragraph(nb_sentences=2)
            time_created = fake.date_time()
            user=rc(users)
            doctor=rc(doctors)
            review = Review(rating=rating, comment=comment, time_created=time_created, user=user, doctor=doctor)
            reviews.append(review)


        db.session.add_all(reviews)
        db.session.commit()

        print('Seeding finished!')