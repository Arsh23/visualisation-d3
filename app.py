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
    returnjson = {}
    for j in json:
        if j['Pulsar'] == name:
            returnjson['Pulsar'] = name
            returnjson['TOAs'] = j['TOAs']
            returnjson['Raw Profiles'] = j['Raw Profiles']
            returnjson['Period'] = str(j['Period']) + ' s'
            returnjson['Period Derivative'] = str(j['Period Derivative']) + ' s/s'
            returnjson['DM'] = str(j['DM']) + ' pc/cc'
            returnjson['RMS'] = str(j['RMS']) + ' us'
            if j['Binary'] == 'Y':
                returnjson['Binary'] = 'Yes'
            else:
                returnjson['Binary'] = 'No'
            break
    return jsonify(returnjson)

@app.route('/add/', methods=['GET', 'POST'])
def add():
    global json
    addjson = {}
    if request.method == 'POST':
        # print request.form
        addjson['Pulsar'] = request.form['Pulsar']
        addjson['TOAs'] = request.form['TOAs']
        addjson['Raw Profiles'] = request.form['Raw Profiles']
        addjson['Period'] = request.form['Period']
        addjson['Period Derivative'] = request.form['Period Derivative']
        addjson['DM'] = request.form['DM']
        addjson['RMS'] = request.form['RMS']
        addjson['Binary'] = request.form['Binary']
        json.append(addjson)
        print json
        return redirect('/')
    else:
        return 'error'

@app.route('/delete/', methods=['GET', 'POST'])
def delete():
    global json
    if request.method == 'POST':
        # print request.form['Pulsar-id']
        if request.form['Pulsar-id'] != 'none':
            for j in json:
                if j['Pulsar'] == request.form['Pulsar-id']:
                    json.remove(j)
                    break

    return redirect('/')

if __name__ == '__main__':
    global json
    r = requests.get('http://msi.mcgill.ca/GSoC_NANOGrav/pulsar_data_test.json')
    json = r.json()
    print 'loading json'
    app.run(debug=True)
