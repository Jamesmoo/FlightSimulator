# tutorial -- https://programminghistorian.org/en/lessons/creating-apis-with-python-and-flask
# tutorial 2 -- https://stackabuse.com/serving-static-files-with-flask/
#import os.path
from flask import Flask
from flask import request, jsonify
import flask
import json  

app = Flask(__name__)

@app.route("/")
def disclaimer():  
    return "<h1>root</h1>"

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

@app.route('/search', methods=['GET'])
def search():
    return jsonify({"results":[{"rank": 1, "user": "Maverick", "score": 1000,"time": 50},{"rank": 2, "user": "Goose", "score": 900, "time": 40},{"rank": 3, "user": "Jester", "score": 800, "time": 40},{"rank": 4, "user": "Merlin", "score": 700, "time": 40},{"rank": 5, "user": "Jester", "score": 800, "time": 40},{"rank": 6, "user": "CowMan", "score": 700, "time": 40}]})

if __name__ == '__main__':
    app.run(debug=True)