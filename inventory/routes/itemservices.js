module.exports = function(app, request) {

	var resJson = [];
	var microserviceBaseUrl = "https://netflix-zuul-cloudnative-dev.mybluemix.net/inventory-microservice/micro";

//	validation check
	app.get('/api/items/validate',function(req, res){
		return res.send("validation successful!");
	});


//	get list of items in inventory
	app.get('/api/items',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory';
		request({
			url: endPoint,
			method: "GET",
			headers: {
    		'Authorization': req.get('Authorization')
  		}
		}, function (error, response, body) {
            if (0 === body.length) {
                return res.send({"error":"no items in inventory"});
            }
			var bodyJson = JSON.parse(body);

			if (!error && response.statusCode == 200) {
				return res.json(bodyJson);
			}else {
				return res.send({"error":error});
			}

		});
	});

//	get item by id
	app.get('/api/items/:id',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory/' + req.params.id;
		request({
			url: endPoint,
			method: "GET",
			headers: {
    		'Authorization': req.get('Authorization')
  		}
		}, function (error, response, body) {
            if (0 === body.length) {
                return res.send({"error":"item not found"});
            }
			var bodyJson = JSON.parse(body);

			if (!error && response.statusCode == 200) {
				return res.json(bodyJson);
			} else {
				return res.send({"error":error});
			}

		});
	});

//	get items containing name
	app.get('/api/items/name/:name',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory/name/' + req.params.name;
		request({
			url: endPoint,
			method: "GET",
			headers: {
    		'Authorization': req.get('Authorization')
  		}
		}, function (error, response, body) {

			if (0 === body.length) {
				body="{}";
			}
			var bodyJson = JSON.parse(body);

			if (!error && response.statusCode == 200) {
				return res.json(bodyJson);
			} else {
				return res.send({"error":error});
			}

		});
	});

//	get items with price less than or equal to
	app.get('/api/items/price/:price',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory/price/' + req.params.price;
		request({
			url: endPoint,
			method: "GET",
			headers: {
    		'Authorization': req.get('Authorization')
  		}
		}, function (error, response, body) {

			var bodyJson = JSON.parse(body);

			if (!error && response.statusCode == 200) {
				return res.json(bodyJson);
			} else {
				return res.send({"error":error});
			}

		});
	});

//	add item to inventory
	app.post('/api/items', function (req, res){

		var endPoint = microserviceBaseUrl + '/inventory';
		//send request with json payload
		request({
			url: endPoint,
			method: "POST",
			headers: {
    		'Authorization': req.get('Authorization')
  		},
			json: req.body
		}, function(error, response, body){

			if (!error && response.statusCode == 200) {
				return res.json(body);
			} else {
				return res.send({"error":error});
			}
		});
	});

//	update item by id
	app.put('/api/items/update/:id',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory/update/' + req.params.id;
		//send request with json payload
		request({
			url: endPoint,
			method: "PUT",
			headers: {
    		'Authorization': req.get('Authorization')
  		},
			json: req.body
		}, function(error, response, body){

			if (!error && response.statusCode == 200) {
				return res.json(body);
			} else {
				return res.send({"error":error});
			}
		});
	});

//	delete item from inventory
	app.delete('/api/items/delete/:id',function(req, res){

		var endPoint = microserviceBaseUrl + '/inventory/delete/' + req.params.id;
		request({url: endPoint,
							method: "DELETE",
							headers: {
				    		'Authorization': req.get('Authorization')
				  		}
						}, function (error, response, body) {

			if (!error && response.statusCode == 200) {
				return res.json(body);
			} else {
				return res.send({"error":error});
			}
		});
	});
};
