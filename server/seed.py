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

        u1 = User(name = fake.first_name(), age = fake.random_int(18,90))
        u2 = User(name = fake.first_name(), age = fake.random_int(18,90))
        u3 = User(name = fake.first_name(), age = fake.random_int(18,90))
        u4 = User(name = fake.first_name(), age = fake.random_int(18,90))
        u5 = User(name = fake.first_name(), age = fake.random_int(18,90))
        
        users.append(u1)
        users.append(u2)
        users.append(u3)
        users.append(u4)
        users.append(u5)
        
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

        r1 = Review(rating = fake.random_int(1,5), comment = fake.paragraph(nb_sentences=2), 
                    time_created = fake.date_time(), user=rc(users), doctor=rc(doctors))
        r2 = Review(rating = fake.random_int(1,5), comment = fake.paragraph(nb_sentences=2), 
                    time_created = fake.date_time(), user=rc(users), doctor=rc(doctors))
        r3 = Review(rating = fake.random_int(1,5), comment = fake.paragraph(nb_sentences=2), 
                    time_created = fake.date_time(), user=rc(users), doctor=rc(doctors))
        r4 = Review(rating = fake.random_int(1,5), comment = fake.paragraph(nb_sentences=2), 
                    time_created = fake.date_time(), user=rc(users), doctor=rc(doctors))

        db.session.add_all([r1, r2, r3, r4])
        db.session.commit()

        print('Seeding Finished!')