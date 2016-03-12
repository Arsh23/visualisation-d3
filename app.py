from flask import Flask, request, session, g, redirect, url_for, render_template, jsonify
import requests
import json

app = Flask(__name__)
json = []

@app.route('/')
def home():
    return render_template('graph.html')

@app.route('/data', methods=['GET'])
def data():
    global json
    return jsonify({'data':json})

@app.route('/data/<name>', methods=['GET'])
def info(name):
    global json
    print json[0]
    return name

if __name__ == '__main__':
    global json
    r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
    json = r.json()
    print 'loading json'
    app.run(debug=True)
