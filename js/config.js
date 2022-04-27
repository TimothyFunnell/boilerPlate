const apiURL = 'https://api-qa.payz.co.za';
const cfURL = 'https://digitalfields.co.za/payz/'
const otherAPI = 'https://enbz4k45rfygq.x.pipedream.net'
const party = '/party-management-service/';
const agreement = '/agreement-management-service/';
const domainPreFix = location.hostname.split('.')[0];
const imgPlaceholderURL = 'https://www.digitalfields.co.za/talentsphere/wwwroot/img/profile/imgPlaceholder.jpeg';
const imgProfilePicPrefix = '';
const displayLog = 1;


const errorList = {
    500: 'Server returned error: 500.',
    401: 'Incorrect Username or Password',
    403: 'Server returned error: 403.',
    404: 'Server returned error: 404.',
}

const altList = {
    204: 'No Data.',
}

//----------------------------

const prefixes = {
    '127': './',
    'mock': '/mock/VURSA/',
    'basrus': '/mock/VURSA/',
}

const imgFolder = {
    '127': 'img/',
    'mock': 'img/',
    'basrus': 'img/',
}

const dTypes = {
    'AJ': 'application/json',
    'MFD': 'multipart/form-data'
  };




const prefix = prefixes[domainPreFix];
const domainClient = 1;
const imgDisplay = prefix + imgFolder[domainPreFix];