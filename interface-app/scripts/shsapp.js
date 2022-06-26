require.config({
    packages: [
        {
            name: 'crypto-js',
            location: 'scripts/bower_components/crypto-js',
            main: 'index'
        }
    ]
});

var sha256, cryptojs, aes;
var dbAddr = 'localhost:8080';

require(["crypto-js"], function (CryptoJS) {
	sha256 = CryptoJS.SHA256;
	cryptojs = CryptoJS;
	aes = CryptoJS.AES;
    // Usage: console.log(sha256("Message").toString(CryptoJS.enc.Base64));
});


var app = angular.module('shsApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: "home.html"
	})
	.when('/login', {
		templateUrl: "login.html"
	})
	.when('/register', {
		templateUrl: "register.html"
	});
});

app.controller('homeController', function ($scope) {
	$scope.groupMembers = [
		'Osasenaga Irabor',
		'Lowman Dylan',
		'Quant Bryan',
		'Housden Nicholas',
		'Deng K'
	];
	
	$scope.loginSubmit = function (employeeId, password) {
		// todo: AES encryption
		id = aes.encrypt(employeeId, "");;
		id = aes.encrypt(employeeId, "");;
		pHash = sha256(password).toString(cryptojs.enc.Base64);
	}
});