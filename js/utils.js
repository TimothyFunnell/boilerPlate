//*****************************************************//
// Other

const downloadFile = (ab, fileName) => {
    const byteArray = new Uint8Array(ab);
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(
      new Blob([byteArray], {
        type: 'application/pdf',
      }),
    );
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
const initPageInstance = async (pageInst, data) => {

const tier = pageInst.pageTier;

for (let item of pageHist) {
    if (item[0] >= tier) {
    const currPage = pageHist.get(item[0]);
    delete pgstr[currPage]
    pageHist.set(item[0], '');
    }
}

pageInst = pgstr[pageInst.reference] ? pgstr[pageInst.reference] : pageInst;
// const oldNew = pgstr[pageInst.reference] ? 0 : 1;

pageHist.set(tier, pageInst.reference);
pgstr[pageInst.reference] = pageInst;

await pageInst.initPage(data || null);

buildBreadCrumbs();

};

const buildBreadCrumbs = () => {

const hist = pageHist;
const bc = id('breadCrumbs');
let firstPage = true;
bc.innerHTML = '';

for (let [key, value] of hist) {
    if (value && firstPage) {
    firstPage = false;
    const btn = divAtt('button', 'class', '');
    btn.setAttribute('onclick', `PREP('${value}', 'reload=true')`);
    btn.innerHTML = 'test';
    bc.appendChild(btn);
    } else if (value) {
    const btn = divAtt('button', 'class', '');
    btn.innerHTML = 'test';
    bc.appendChild(btn);
    }
}
};

const reloadPage = async (htmlPage, reference) => {

const hdrs = await getAuthHdrs();
const recipe = await getRecipe();
recipe.page = htmlPage;

await SWITCHBOX(recipe, hdrs, vars);
pgstr[reference].loadPage();

}

const changeTabN = async (newTab, vars) => {
const tabList = document.querySelectorAll('.tablinks')
const recipe = await getRecipe()
recipe.page = newTab;
recipe.div = 'contentContainer';
tabList.forEach(tab => {
    tab.classList.contains('active') && tab.classList.remove('active');
    tab.id == newTab && tab.classList.add('active');
})
PREP(recipe, vars || {})
    .catch(console.error())
};

const directTab = vars => {

changeTabN(vars.dTab || document.querySelector('.tablinks').id);

};

const insertDiv = async (html, div, vars) => {
await getRecipe()
    .then(async recipe => {
    recipe.page = html;
    recipe.div = div;
    await PREP(recipe, vars || {})
        .catch(console.error());
    })
};

const loader = io => {
if (id('loader')) {
    id('loader').style.display = io ? 'block' : 'none';
}
};

const logout = code => {

// PREP(['logLogout'], {
//   initCode: code
// })
console.log('code: ', code)
initSession();
location.reload();
};

const passwordReminder = () => {
btnModalOn('loginBtn');

const email = id('f_username').value;
const emailInput = id('f_username');
// const feedback = id('feedback');

const vars = {};
vars.emailAddress = email;

if (valE(email)) {
    PREP(['passwordReminder'], vars)
    .then(res => {
        btnModalOff('loginBtn');
        if (res.data.passwordReminder_SC === 200) {
        infoBox(res.data.passwordReminder);
        // id('feedbackBanner').classList.add('feedbackBannerGood')
        // feedback.innerHTML = res.data.passwordReminder;
        // hide('warningSVG');
        // unhide('succSVG')
        } else {
        emailInput.classList.add('incorrect');
        errBox(res.data.passwordReminder);
        // feedback.innerHTML = res.data.passwordReminder;
        // unhide('warningSVG');
        // hide('succSVG')
        }

    }).catch(console.error())
} else {
    btnModalOff('loginBtn');
    emailInput.classList.add('incorrect');
    errBox('This is not a valid email address');
    // unhide('warningSVG');
    // hide('succSVG')
}
};

const isNum = pass => {
const regx = /^\d+$/g;
return regx.test(pass) ? true : false;
};

const createJSONString = async (obj1, obj2) => {

return JSON.stringify({
    ...obj1,
    ...obj2
})
}

const isEmpty = obj => {
for (var key in obj) {
    if (obj.hasOwnProperty(key))
    return false;
}
return true;
}

const removeIncorrect = inpID => {
id(inpID).classList.remove('incorrect');
};

const parseIntObj = async obj => {

const newObj = {};

for (let key in obj) {
    (parseInt(obj[key])) && (newObj[key] = parseInt(obj[key]));
}
return newObj
}

const urlToObj = async url => {
const request = new Object();
if (url != undefined) {
    const pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (let i = 0; i < pairs.length; i++) {
    if (pairs[i]) {
        const pair = pairs[i].split('=');
        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    }
    return request;
}
};

const cObj = data => {
const list = new Array;
if (data) {
    for (var d = 0; d < data.DATA.length; d++) {
    var obj = new Object;
    for (var h = 0; h < data.DATA[d].length; h++) {
        obj[data.COLUMNS[h]] = data.DATA[d][h];
    }
    list.push(obj)
    }
}
return list;
};

const lowCase = pass => {
const regx = /[a-z]+/g;
return regx.test(pass) ? true : false;
};

const confirmPass = (curr, conf) => {
return (curr !== conf) ? false : true;
};

const hidePassBox = () => {
hide('passValBox');
hide('passMatchBox');
};

const buildDropDownMain = (data, elID, value, text) => {
const split = text.split('+');
const el = id(elID);
el.options.length = '';
let optOne;

if (data.length) {
    optOne = divAtt('option', 'value', '-');
    optOne.innerHTML = 'Please Choose An Option ---';
    el.appendChild(optOne);
    data.forEach(arr => {
    const opt = divAtt('option', 'value', arr[`${value}`]);
    const desc = [];
    split.forEach(piece => {
        desc.push(arr[piece])
    })
    opt.innerHTML = desc.join(' ');
    el.appendChild(opt);
    })
} else {
    optOne = divAtt('option', 'value', '-');
    optOne.innerHTML = 'No options available --';
    el.appendChild(optOne);
}
};

const hide = elID => {
const el = document.getElementById(elID)
if (!el.classList.contains('hide')) {
    el.classList.add('hide')
}
};

const unhide = elID => {
const el = document.getElementById(elID)
if (el.classList.contains('hide')) {
    el.classList.remove('hide')
}
};

const toggleHide = elID => {
const el = id(elID);
if (el.classList.contains('hide')) {
    el.classList.remove('hide')
} else {
    el.classList.add('hide')
}
};

const eListen = (elID, callback, eventType) => {
const evnt = eventType ? eventType : 'change'
const oldNode = id(elID)
const newNode = oldNode.cloneNode(true);
oldNode.parentNode.replaceChild(newNode, oldNode);
newNode.addEventListener(evnt, () => {
    callback()
})
};

const addAtt = (el, attribute, value) => {
a = document.createAttribute(attribute);
a.value = value;
el.setAttributeNode(a);
return el
}

const invisible = eli => {
const el = id(eli)
if (!el.classList.contains('invisible')) {
    el.classList.add('invisible')
}
};

const uninvisible = eli => {
const el = id(eli)
if (el.classList.contains('invisible')) {
    el.classList.remove('invisible')
}
};

const notEmptyVal = elID => {

const feedback = `${elID}_FB`;

if (!id(elID).value || id(elID).value == '-') {
    id(elID).classList.add('incorrect');
    if (id(feedback)) {

    if (id(elID).value == '-') {
        id(feedback).innerHTML = 'Please select an option.';
    } else {
        id(feedback).innerHTML = 'Please fill in required field.'
    }
    unhide(feedback)
    }
} else {
    id(elID).classList.remove('incorrect');
    if (id(feedback)) {
    id(feedback).innerHTML = '';
    hide(feedback);
    }
}

// id(elID).classList.add('correct');

}

const mobNumVal = elID => {

const feedback = `${elID}_FB`;
const mobNum = id(elID).value;


if (valP(mobNum)) {
    id(elID).classList.remove('incorrect');
    id(feedback).innerHTML = '';
    hide(feedback);
} else {
    id(elID).classList.add('incorrect');
    id(feedback).innerHTML = 'Invalid mobile number.';
    unhide(feedback)
}

}

const eAddressVal = elID => {

const feedback = `${elID}_FB`;
const email = id(elID).value;


if (valE(email)) {
    id(elID).classList.remove('incorrect');
    id(feedback).innerHTML = '';
    hide(feedback);
} else {
    id(elID).classList.add('incorrect');
    id(feedback).innerHTML = 'Invalid email address';
    unhide(feedback)


}

}

const valE = email => {
const regx = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9-]+)(.[ujUJ]{2})?\.([a-zA-Z]{2,20})(\.[a-zA-Z]{2,10})?$/;
return regx.test(email) ? true : false;
};

const valP = num => {

num = isNaN(num) ? num : num.toString();
num = num.split(' ').join('')
const regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{2,3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
return (regex.test(num)) ? true : false;
};

const DOBVal = elID => {

const feedback = `${elID}_FB`;
const infoText = window.infoText;
const DOB = id(elID).value;

if (valDOB(DOB)) {
    id(elID).classList.remove('incorrect');
    id(feedback).innerHTML = '';
    hide(feedback);
} else {
    id(elID).classList.add('incorrect');
    id(feedback).innerHTML = infoText.inf_Mkr20 ? infoText.inf_Mkr20 : 'Invalid date of birth.'
    unhide(feedback)
}

}

const inpFeedbackBanner = msg => {
const err = id('feedback');
err.innerHTML = ''
err.innerHTML = `${msg}`;
unhide('feedbackBanner');
};

const validatePage = () => {

const userInputs = document.querySelectorAll('input, select, textarea');
const returnMessage = [];
let passValue = true;

// Class list:
// mobNum
// notEmpty
// eAddress
// notDash


if (userInputs.length) {
    userInputs.forEach(inp => {

    const continueV = inp.closest('.hide') ? false : true;
    const infoText = window.infoText

    if (!inp.classList.contains('hide') || continueV) {
        // Is the input a mobile number
        if (inp.classList.contains('mobNum')) {
        // Does the mobile number also have a notEmpty class
        if (inp.classList.contains('notEmpty')) {
            // Is the mobile number empty
            if (!(inp.value).trim()) {
            passValue = false;
            rejectElem(inp);
            returnMessage.push('Mobile number is a required field.');
            } else {
            // Vlidate mobile number
            if (valP(inp.value)) {
                passElem(inp)
            } else {
                passValue = false;
                rejectElem(inp);
                returnMessage.push('Invalid mobile number.');
            }
            }
        } else {
            // If notEmpty class absent but a value is still inputted
            if ((inp.value).trim()) {
            if (valP(inp.value)) {
                passElem(inp)
            } else {
                passValue = false;
                rejectElem(inp)
                returnMessage.push('Invalid mobile number.');
            }
            }
        }
        } else if (inp.classList.contains('eAddress')) {
        // Does the email address also have a notEmpty class
        if (inp.classList.contains('notEmpty')) {
            // Is the mobile number empty
            if (!(inp.value).trim()) {
            passValue = false;
            rejectElem(inp)
            returnMessage.push('Email Address is a required field.');
            } else {
            // Validate emailAddress
            if (valE(inp.value)) {
                passElem(inp)
            } else {
                passValue = false;
                rejectElem(inp)
                returnMessage.push('Invalid Email Address.');
            }
            }
        } else {
            // If notEmpty class absent but a value is still inputted
            if ((inp.value).trim()) {
            if (valE(inp.value)) {
                passElem(inp)
            } else {
                passValue = false;
                rejectElem(inp)
                returnMessage.push('Invalid Email Address.');
            }
            }
        }
        } else if (inp.classList.contains('notEmpty')) {
        // Simple validation check to make sure not empty
        if (!(inp.value).trim()) {
            passValue = false;
            rejectElem(inp)
            returnMessage.push('Please fill in all required fields.');
        } else {
            passElem(inp)
        }
        } else if (inp.classList.contains('notDash')) {
        // Simple validation check to make sure not empty
        if (!(inp.value).trim() || inp.value === '-') {
            passValue = false;
            rejectElem(inp)
            returnMessage.push('Please select an option from all required dropdowns.');
        } else {
            passElem(inp)
        }
        }
    }
    })
}

if (id('feedback')) {
    if (returnMessage.length) {
    inpFeedbackBanner(returnMessage[0])
    } else {
    id('feedbackBanner') && hide('feedbackBanner')
    }
};


return passValue
}

const removeVal = elID => {
id(elID).classList.remove('incorrect');

}

const rejectElem = elem => {

const elemID = elem.id;

if (!id(elemID).classList.contains('incorrect')) {
    id(elemID).classList.add('incorrect')

}
};

const passElem = elem => {

const elemID = elem.id;
if (id(elemID).classList.contains('incorrect')) {
    id(elemID).classList.remove('incorrect')
}
};

const navSel = (navID) => {
const navItems = document.querySelectorAll('.navItem')
navItems.forEach(navItem => {
    navItem.classList.remove('navActive')
})
id(navID).classList.add('navActive')

PREP(navID)

};

const dateFromDateTime = (date) => {
var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];
var date = new Date(date)
// console.log(date);
var day = date.getDate();
var monthIndex = date.getMonth();
var year = date.getFullYear();

return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

const viewPass = (inpID, eyeID) => {
const input = id(inpID);
const eye = id(eyeID);
if (input.type === "password") {
    input.type = "text";
    eye.classList.add('iconOn')
} else {
    input.type = "password";
    eye.classList.remove('iconOn')
}
};

const capsLock = inpID => {

const el = id(inpID);
el.addEventListener('keydown', e => {
    e.getModifierState('CapsLock') ?
    unhide('capsLock') :
    hide('capsLock');
});
};

const fetchCF = data => {
const url = 'https://digitalfields.co.za/payz/agreement3.cfm'
fetch(url, {
    method: 'POST',
    body: data,
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
}).then(response => {
    return response.arrayBuffer();
}).then(parseData => {
    downloadFile(parseData, 'Agreement');
}).catch(console.error())
}