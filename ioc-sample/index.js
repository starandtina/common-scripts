const Container = require('../ioc');
const A = require('./A');

const container = new Container();
const a = container.get(A);
a.b.hello();
