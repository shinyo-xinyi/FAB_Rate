import json

from database import *
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
CORS(app, supports_credentials=True)


@app.route('/sendData', methods=['POST'])
def pass_data():
    # Communicate with the front end
    data = request.get_data().decode('utf-8')
    url = json.loads(data)
    dic = get_dic(url)
    json_dic = json.dumps(dic)
    return json_dic


if __name__ == '__main__':
    # Load data from database and run the application
    read_db()
    app.run(port=5000, debug=True)
