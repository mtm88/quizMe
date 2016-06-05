exports.config = {  
        capabilities: {
            'browserName': 'chrome',
            'chromeOptions': {                
                args: ['--disable-web-security']
            } 
        },
        baseUrl: 'http://192.168.0.4:8100',
        specs: [
            'e2e-tests/**/*.tests.js'
        ],
        jasmineNodeOpts: {
            isVerbose: true,
        }
};