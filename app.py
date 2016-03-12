from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
import requests
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sample')
def sample():
    r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
    data = r.json()
    print data[0]
    return str(data[0]['Pulsar'])


if __name__ == '__main__':
    app.run(debug=True)
