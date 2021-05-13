var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var app = express();
app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
	host: 'localhost',
	user: '***',
	password: '*******',
	database: 'guitars',
	port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/', function(req, res){
	res.render('start');
});

app.get('/list', function(req, res){

	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM guitars',function(err,rows){
			var guitarList=rows;
			res.render('list',{
				guitarList:guitarList
			});
		});
	});
});

app.get('/add', function(req, res){
	res.render('add');
});

app.post('/add', function(req, res){
	var guitar={
		name: req.body.name,
		year: req.body.year
	}
	console.log(guitar);
	req.getConnection(function(error, conn){
		conn.query('INSERT INTO guitars SET ?',guitar,function(err,rows){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dane zostały dodane';
			}
			res.render('add',{message:message});
		});
	});
});

app.get('/edit/(:id)', function(req, res){
	var guitar_id=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM guitars WHERE id='+guitar_id,function(err,rows){
			res.render('edit',{
				id: guitar_id,
				name: rows[0].name,
				year: rows[0].year
			});
		});
	});
});

app.post('/edit/(:id)', function(req, res){
	var guitar_id=req.params.id;
	var guitar={
		name: req.body.name,
		year: req.body.year
	};
	req.getConnection(function(error, conn){
		conn.query('UPDATE guitars SET ? WHERE id='+guitar_id,guitar,function(err,rows){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dane zostały zmienione';
			}
			res.render('edit',{
				id: req.params.id,
				name: req.body.name,
				year: req.body.year,
				message:message
			});
		});
	});
});

app.get('/delete/(:id)', function(req, res){
	var guitar_id=req.params.id;
	res.render('delete',{guitar_id:guitar_id});
});

app.post('/delete/(:id)', function(req, res){
	var guitar_id=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('DELETE FROM guitars WHERE id='+guitar_id,function(err,rows){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dane zostały usunięte';
			}
			res.render('delete',{guitar_id:guitar_id,message:message});
		});
	});
});

app.listen(3000);
