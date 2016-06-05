describe('Clicking on the login with JWT button', function() {

	var loginButton;

	var username, password, signInButton;


	beforeEach(function() {
		browser.get('#/app/login');
		loginButton = element(by.css('.button.button-royal.button-block'));

				username = element(by.model('login_ctrl.username'));
				password = element(by.model('login_ctrl.password'));

				signInButton = element(by.css('.button.button-full.button-positive'));

	});

	afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
	});

	it('should click on the button to go through to JWT login', function() {

		loginButton.click().then(function() {
			username.sendKeys('gerion');
			password.sendKeys('mtm');

			signInButton.click().then(function() {
				expect(browser.getLocationAbsUrl()).toMatch('/app/home');

				var elements = element.all(by.repeater(''))

			})
		})							
	});

	it('should fail to login with wrong user data', function() {
		loginButton.click().then(function() {
			username.sendKeys('wrongUsername');
			password.sendKeys('wrongPassword');

			signInButton.click().then(function() {
				expect(browser.getLocationAbsUrl()).toMatch('/app/login');
			});
		});
	});
	

});