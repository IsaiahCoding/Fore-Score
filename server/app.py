#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from datetime import datetime
# Local imports
from config import app, db, api
# Add your model imports
from models import User, Club, ClubDistance, ClubDistanceJoin, Scorecard, HoleStat


# #Views go here!
# allowed_endpoints = ['signup', 'login', 'check_session']
# @app.before_request
# def check_if_logged_in():
#     if not session.get('user_id') and request.endpoint not in allowed_endpoints:
#         return {'error': 'Unauthorized'}, 401
    
    
    

@app.route('/clubs', methods=['GET', 'POST'])
def club():
    if request.method == 'GET':
        clubs = Club.query.all()
        clubs_dict = [club.to_dict(rules=('-club_distances',)) for club in clubs]
        return make_response(clubs_dict, 200)
    elif request.method == 'POST':
        data = request.get_json()
        if data:
            club = Club(name=data.get('name'), brand=data.get('brand'))
            db.session.add(club)
            db.session.commit()
            return make_response(club.to_dict(rules=('-club_distances',)), 201)
        else:
            return make_response({'error': 'No data provided'}, 400)

@app.route('/clubs/<int:club_id>', methods =['GET', 'PATCH', 'DELETE'])
def club_id(club_id):
    club = Club.query.get(club_id)
    if club:
        if request.method == 'GET':
            return make_response(club.to_dict(rules=('-club_distances',)), 200)
        elif request.method == 'PATCH':
            data = request.get_json()
            if data:
                club.name = data.get('name', club.name)
                club.brand = data.get('brand', club.brand)
                db.session.commit()
                return make_response(club.to_dict(rules=('-club_distances',)), 200)
            else:
                return make_response({'error': 'No data provided'}, 400)
        elif request.method == 'DELETE':
            db.session.delete(club)
            db.session.commit()
            return make_response({'message': 'Club deleted'}, 200)
    else:
        return make_response({'error': 'Club not found'}, 404)

@app.route('/users')
def users():
    users = User.query.all()
    users_dict = [user.to_dict(rules=('-club_distances','-scorecards',)) for user in users]
    return make_response(users_dict, 200)


@app.route('/users/<int:user_id>', methods =['GET', 'PATCH', 'DELETE'])
def user_id(user_id):
    user = User.query.get(user_id)
    if user:
        if request.method == 'GET':
            return make_response(user.to_dict(rules=('-club_distances','-scorecards',)), 200)
        elif request.method == 'PATCH':
            data = request.get_json()
            if data:
                user.name = data.get('name', user.name)
                user.username = data.get('username', user.username)
                user.email = data.get('email', user.email)
                db.session.commit()
                return make_response(user.to_dict(rules=('-club_distances','-scorecards',)), 200)
            else:
                return make_response({'error': 'No data provided'}, 400)
        elif request.method == 'DELETE':
            db.session.delete(user)
            db.session.commit()
            return make_response({'message': 'User deleted'}, 200)
    else:
        return make_response({'error': 'User not found'}, 404)

class Signup(Resource):
    def post (self):
        json = request.get_json()
        try:
            user = User(
                name = json['name'],
                username = json['username'],
                email = json['email'],
                )
            user.password_hash = json['password']
            db.session.add(user)
            db.session.commit()
            
            session['user_id'] = user.id
            
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
        
api.add_resource(Signup, '/signup', endpoint='signup')

class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return make_response({'error': 'User not found'}, 404)
        else:
            if user.authenticate(password):
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
            else:
                return make_response({'error': 'Incorrect Entry'}, 401)
            
api.add_resource(Login, '/login', endpoint='login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'Logged out'}, 200)

api.add_resource(Logout, '/logout', endpoint='logout')

class CheckSession(Resource):

    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

api.add_resource(CheckSession, '/check_session')



@app.route('/club_distance', methods=['GET', 'POST'])
def club_distance():
    if request.method == 'GET':
        club_distances = ClubDistance.query.all()
        club_distances_dict = [club_distance.to_dict( ) for club_distance in club_distances]
        return make_response(club_distances_dict, 200)
    elif request.method == 'POST':
        data = request.get_json()
        if data:
            club_distance = ClubDistance(club_id=data.get('club_id'), distance=data.get('distance'))
            db.session.add(club_distance)
            db.session.commit()
            return make_response(club_distance.to_dict(), 201)
        else:
            return make_response({'error': 'No data provided'}, 400)

@app.route('/club_distance/<int:club_distance_id>', methods =['GET', 'PATCH', 'DELETE'])
def club_distance_id(club_distance_id):
    club_distance = ClubDistance.query.get(club_distance_id)
    if club_distance:
        if request.method == 'GET':
            return make_response(club_distance.to_dict(rules = '',), 200)
        elif request.method == 'PATCH':
            data = request.get_json()
            if data:
                club_distance.club_id = data.get('club_id', club_distance.club_id)
                club_distance.distance = data.get('distance', club_distance.distance)
                db.session.commit()
                return make_response(club_distance.to_dict(), 200)
            else:
                return make_response({'error': 'No data provided'}, 400)
        elif request.method == 'DELETE':
            db.session.delete(club_distance)
            db.session.commit()
            return make_response({'message': 'Club Distance deleted'}, 200)
    else:
        return make_response({'error': 'Club Distance not found'}, 404)
    

@app.route('/scorecard/', methods=['GET', 'POST'])
def scorecard():
    if request.method == 'GET':
        scorecards = Scorecard.query.all()
        scorecards_dict = [scorecard.to_dict(rules=('-user',)) for scorecard in scorecards]
        return make_response(scorecards_dict, 200)
    elif request.method == 'POST':
        data = request.get_json()
        if data:
            scorecard = Scorecard(user_id=data.get('user_id'), date=datetime.now())
            db.session.add(scorecard)
            db.session.commit()
            return make_response(scorecard.to_dict(rules=('-user',)), 201)
        else:
            return make_response({'error': 'No data provided'}, 400)

@app.route('/scorecard/<int:scorecard_id>', methods =['GET', 'PATCH', 'DELETE'])
def scorecard_id(scorecard_id):
    scorecard = Scorecard.query.get(scorecard_id)
    if scorecard:
        if request.method == 'GET':
            return make_response(scorecard.to_dict(), 200)
        elif request.method == 'PATCH':
            data = request.get_json()
            if data:
                scorecard.user_id = data.get('user_id', scorecard.user_id)
                scorecard.date = data.get('date', scorecard.date)
                db.session.commit()
                return make_response(scorecard.to_dict(rules=('-user',)), 200)
            else:
                return make_response({'error': 'No data provided'}, 400)
        elif request.method == 'DELETE':
            db.session.delete(scorecard)
            db.session.commit()
            return make_response({'message': 'Scorecard deleted'}, 200)
    else:
        return make_response({'error': 'Scorecard not found'}, 404)

@app.route('/holestats', methods=['GET','POST'])
def holestats():
    if request.method == 'GET':
        holestats = HoleStat.query.all()
        holestats_dict = [holestat.to_dict() for holestat in holestats]
        return make_response(holestats_dict, 200)
    elif request.method == 'POST':
        data = request.get_json()
        if data:
            holestat = HoleStat(
                scorecard_id = data.get('scorecard_id'),
                hole_number = data.get('hole_number'),
                par = data.get('par'),
                score = data.get('score'),
                putts = data.get('putts'),
                fairway = data.get('fairway'),
                green = data.get('green'),
                bunker = data.get('bunker'),
                penalty = data.get('penalty'),
                )
            db.session.add(holestat)
            db.session.commit()
            return make_response(holestat.to_dict(), 201)
        else:
            return make_response({'error': 'No data provided'}, 400)

@app.route('/holestats/<int:holestat_id>', methods =['GET', 'PATCH', 'DELETE'])
def holestat_id(holestat_id):
    holestat = HoleStat.query.get(holestat_id)
    if holestat:
        if request.method == 'GET':
            return make_response(holestat.to_dict(), 200)
        elif request.method == 'PATCH':
            data = request.get_json()
            if data:
                holestat.scorecard_id = data.get('scorecard_id', holestat.scorecard_id)
                holestat.hole_number = data.get('hole_number', holestat.hole_number)
                holestat.par = data.get('par', holestat.par)
                holestat.score = data.get('score', holestat.score)
                holestat.putts = data.get('putts', holestat.putts)
                holestat.fairway = data.get('fairway', holestat.fairway)
                holestat.green = data.get('green', holestat.green)
                holestat.bunker = data.get('bunker', holestat.bunker)
                holestat.penalty = data.get('penalty', holestat.penalty)
                db.session.commit()
                return make_response(holestat.to_dict(), 200)
            else:
                return make_response({'error': 'No data provided'}, 400)
        elif request.method == 'DELETE':
            db.session.delete(holestat)
            db.session.commit()
            return make_response({'message': 'Holestat deleted'}, 200)
    else:
        return make_response({'error': 'Holestat not found'}, 404)

        




if __name__ == '__main__':
    app.run(port=5555, debug=True)

