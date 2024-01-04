from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

app.config.from_object(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})


MEMBERS = [
    {
        'name': 'Ralph',
        'age': '22',
        'birthday': 'May 16, 2001'
    }
]


@app.route('/')
def index():
    return "<p>Hello</p>"

@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong')


@app.route('/members', methods=['GET'])
def members():
    return jsonify({
        'status' : 'success',
        'members': MEMBERS
    })

if __name__ == "__main__":
    app.run() 