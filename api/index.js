const express = require('express')
const python = require('python-shell')
const app = express()

app.get('/', function(req, res) {
	console.log('Hello World!\n')
	res.send('Hello World!\n')
})

function runPythonScript(path) {
  console.log('runPythonScript(' + path + ')')
  python.run(path, function(err) {
    if (err) throw err;
    console.log('finished')
  })
}

app.get('/on', function(req, res) {
  console.log("/on")
  runPythonScript('../scripts/on.py')
})


app.get('/off', function(req, res) {
  console.log("/off")
  runPythonScript('../scripts/off.py')
})

app.listen(3000, function() {
  console.log('App is listening on port 3000!')
})
