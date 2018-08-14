// var express = require('express');
var router = express.Router();
import express from 'express';
import mysql from '../lib/mysql';
import todo from '../models/todo';
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3002 });

wss.on('connection', function connection(ws) {
	console.log('websocket connection');
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send('something');
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/todolist', async function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed

	let result = await todo.get();

	res.send(
		JSON.stringify({
			result
		})
	);
});

router.post('/add/todolist', async function(req, res, next) {
	var params = {};
	params['value'] = req.body.value;
	params['complete'] = req.body.complete;
	params['uid'] = req.body.uid;

	let result = await todo.insert(params);

	res.send(
		JSON.stringify({
			result
		})
	);
});

router.post('/update/todolist/:uid', async (req, res, next) => {
	let uid = req.params.uid;
	let complete = req.body.complete;
	let result = 1;

	if (!uid) {
		result = -1;
		res.send(
			JSON.stringify({
				result
			})
		);
	}

	result = await todo.update({
		uid: uid,
		complete: complete
	});

	res.send(
		JSON.stringify({
			result
		})
	);
});

module.exports = router;
