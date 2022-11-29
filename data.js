const Router = require('koa-router');

const router = new Router({
	prefix: '/data'
});

const data = require('./data.json');

router.get('/', (ctx, next) => {
    ctx.body = data;
    next();
});

router.post('/add', (ctx, next) => {
	if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
		!ctx.request.body.email || 
    !ctx.request.body.gender|| 
    !ctx.request.body.address || 
    !ctx.request.body.phone 
	) {
		ctx.response.status = 400;
		ctx.body = 'Please enter the data';
	} else {
		let newData= data.push({
			id: ctx.request.body.id,
			name: ctx.request.body.name,
			email: ctx.request.body.email,
      gender: ctx.request.body.gender,
      address: ctx.request.body.address,
      phone: ctx.request.body.phone
		});
		ctx.response.status = 201;
		ctx.body = `New item = added with id: ${ctx.request.body.id} & item name: ${
			ctx.request.body.name
		}`;
	}
	next();
});

// Routes
module.exports = router;