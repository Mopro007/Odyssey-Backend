#testing server

from flask import Flask, request

app = Flask(__name__)

# Signup API route
@app.route('/signup', methods=['POST'])
def signup():
    print(request.get_json())
    return "OK"

# Signin API route
@app.route('/signin',methods=['POST'])
def signin():
    print(request.get_json())
    return "OK"

# New User Profile API route
@app.route('/profile', methods=['POST'])
def newProfile():
    print(request.get_json())
    return "OK"

# Get Profile API route
@app.route('/profile', methods=['GET'])
def getProfile():
    print(request.get_json())
    return "OK"

# Browse Odysseys API route
@app.route('/browseodysseys', methods=['GET'])
def browseOdysseys():
    print(request.get_json())
    return "OK"

# New Odyssey API route
@app.route('/newodyssey', methods=['POST'])
def newOdyssey():
    print(request.get_json())
    return "OK"

# Participate API route
@app.route('/participate', methods=['POST'])
def participate():
    print(request.get_json())
    return "OK"

# UnParticipate API route
@app.route('/unparticipate', methods=['POST'])
def unparticipate():
    print(request.get_json())
    return "OK"

# Call_for_Vote API route
@app.route('/callforvote', methods=['POST'])
def callforvote():
    print(request.get_json())
    return "OK"

# UpVote API route
@app.route('/upvote', methods=['POST'])
def vote():
    print(request.get_json())
    return "OK"

# DownVote API route
@app.route('/downvote', methods=['POST'])
def downvote():
    print(request.get_json())
    return "OK"

# get feed API route
@app.route('/feed', methods=['GET'])
def getFeed():
    print(request.get_json())
    return "OK"

#like post API route
@app.route('/likepost', methods=['POST'])
def likePost():
    print(request.get_json())
    return "OK"

if __name__ == "__main__":
    app.run(debug=True)
