var $$ = Dom7;
var app = new Framework7({
	root: '#app',
	name: 'My App',
	id: 'com.myapp.test',
	panel: {
		swipe: 'left',
	},
	routes: [
		{
			path: '/about/',
			url: './pages/about.html',
			name: 'about',
		},
	],
});