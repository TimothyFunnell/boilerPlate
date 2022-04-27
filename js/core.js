//*****************************************************//
// Core Engine

const PREP = async (rec, oldVars) => {
  //-------------------------
  // Add Modal
  loader(1);
  //-------------------------
  // Set the Variables
  const vars = typeof (oldVars) == 'string' ? await urlToObj(oldVars) : oldVars || {};
  //-------------------------
  // Get the headers
  const hdrs = await getAuthHdrs();
  //-------------------------
  // Set the Recipe
  let recipe = rec;
  if (Array.isArray(rec)) {
    recipe = await getRecipe();
    recipe.methods = rec;
    delete recipe.page;
    return SWITCHBOX(recipe, hdrs, vars);
  } else {
    if (typeof (rec) == 'string') {
      recipe = await getRecipe()
      recipe.page = rec;
    }
    if (dist.hasOwnProperty(recipe.page)) {
      dist[recipe.page](recipe, hdrs, vars)
    } else {
      return SWITCHBOX(recipe, hdrs, vars);
    }
  }
  loader(0)
};

const SWITCHBOX = async (recipe, hdrs, vars) => {

  vars = vars ? vars : {};
  //-------------------------
  // Try/Catch
  try {
    const html = recipe.page ? await fetchHTML(recipe.page) : void(0);
    const t0 = performance.now();
    const data = recipe.methods.length ? await fetchMethods(recipe, hdrs, vars) : {};
    const t1 = performance.now();
    const Performance = `${t1 - t0} milliseconds.`;
    html && (id(recipe.div).innerHTML = html);

    const response = {
      recipe,
      data,
      vars,
      Performance
    };
    displayLog && logRes({
      ...response
    });
    loader(0);
    return response
  } catch (err) {
    loader(0);
    errBox(err);
    throw err
  }
};

const logRes = res => {

  let dataObj = {};
  let statusCodes = {};
  let statusTexts = {};

  for (let item in res.data) {
    let split = item.split('_');
    if (split.length > 1) {
      if (split[1] === 'SC') {
        statusCodes[item] = res.data[item];
      } else {
        statusTexts[item] = res.data[item];
      }
    } else {
      dataObj[item] = res.data[item];
    }
  }
  res.data = dataObj;
  res.statusCodes = statusCodes;
  res.statusTexts = statusTexts;
  console.log('Response (SB): ', res);
};

const getRecipe = async () => {

  return {
    endPoint: apiURL,
    page: '',
    methods: [],
    tabs: 0,
    div: 'mainContainer',
    scroll: 1
  };
};

const getAuthHdrs = async () => {
  const vars = {};
  // vars['Ocp-Apim-Subscription-Key'] = '6600b221d3ee49ce8aafc24ba762c35b'
  // vars.UUID = getCookie('ewttgpvwwkf');
  // vars.userId = parseInt(getCookie('userId'));
  // vars.deviceUUID = getCookie('fgxkegwwkf');
  // vars.languageID = getCookie('mbohvbhfje');

  return vars;
};

const mPOST = (method, shortType) => {

  const dataType = shortType ? dTypes[shortType] : dTypes.AJ;

  return {
    method: method,
    methodType: 'POST',
    dataType: dataType
  }
};

const mGET = method => {
  return {
    method: method,
    methodType: 'GET',
  }
};

const mPUT = method => {
  return {
    method: method,
    methodType: 'PUT',
  }
};

const mDELETE = method => {
  return {
    method: method,
    methodType: 'DELETE',
  }
};

const fetchMethods = async (recipe, hdrs1, vars1) => {

  const methods = recipe.methods;
  let data = {};
  // const hdrs1 = await parseIntObj(hdrs);
  // const vars1 = await parseIntObj(vars);


  await Promise.all(methods.map(async method => {
    let mName = (method.method).split('/');
    let response;
    let headers;
    switch (method.methodType) {
      // GET ***************************************
      case 'GET':
        response = await fetchMethodGET(recipe, method.method);
        break;

        // PUT ***************************************
      case 'PUT':
        headers = await createJSONString(hdrs1, vars1);
        response = await fetchMethodPUT(recipe, headers, method.method);
        break;

        // POST ***************************************
      case 'POST':

        if (method.dataType === 'application/json') {
          headers = await createJSONString(hdrs1, vars1);
        } else if (method.dataType === 'multipart/form-data') {
          headers = await cfd(hdrs1, vars1);
        } else {
          throw new Error('Invalid data type');
        }

        response = await fetchMethodPOST(recipe, headers, method);
        break;
    }
    mName = mName[mName.length - 1];
    data[`${mName}_SC`] = response.statusCode;
    data[`${mName}_ST`] = response.statusText;
    data[mName] = response.data;
  }))
  return data
};

function fetchMethodGET(recipe, method) {
  return new Promise((resolve, reject) => {
    let isAltCode;
    let res;
    fetch(`${recipe.endPoint}${method}`, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': '6600b221d3ee49ce8aafc24ba762c35b'
        },
      })
      .then(response => {
        if (errorList.hasOwnProperty(response.status)) {
          reject(errorList[response.status]);
        } else {
          res = response;
          isAltCode = (altList.hasOwnProperty(res.status));
          return (!isAltCode) ? response.json() : res;
        }
      })
      .then(parseData => {
        resolve({
          data: (!isAltCode) ? parseData : [],
          statusCode: res.status,
          statusText: res.statusText
        })
      }).catch(console.error())
  })
}

function fetchMethodPOST(recipe, body, method) {
  return new Promise((resolve, reject) => {

    let res;
    const headers = {};
    headers['Ocp-Apim-Subscription-Key'] = '6600b221d3ee49ce8aafc24ba762c35b';

    if (method.dataType === 'application/json') {
      headers['Content-Type'] = 'application/json';
    }

    fetch(`${recipe.endPoint}${method.method}`, {
        method: 'POST',
        body: body,
        headers: headers,
      })
      .then(response => {
        if (errorList.hasOwnProperty(response.status)) {
          reject(errorList[response.status]);
        } else {
          res = response
          return response.json()
        }
      })
      .then(parseData => {
        resolve({
          data: parseData,
          statusCode: res.status,
          statusText: res.statusText
        })
      }).catch(console.error())
  })
}

function fetchMethodPUT(recipe, body, method) {
  return new Promise((resolve, reject) => {
    let res;
    fetch(`${recipe.endPoint}${method}`, {
        method: 'PUT',
        body: body,
        mode: 'cors',
        headers: {
          'Ocp-Apim-Subscription-Key': '6600b221d3ee49ce8aafc24ba762c35b',
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
        if (errorList.hasOwnProperty(response.status)) {
          reject(errorList[response.status]);
        } else {
          res = response
          return response.json()
        }
      })
      .then(parseData => {
        resolve({
          data: parseData,
          statusCode: res.status,
          statusText: res.statusText
        })
      }).catch(console.error())
  })
}

function fetchHTML(pageName) {

  return new Promise((resolve, reject) => {
    const html = `${prefix}${pageName}.html`
    fetch(html)
      .then(response => {
        if (response.status === 404) {
          reject(`404 - ${html} not found`);
        } else {
          window.scrollTo(0, 0);
          const page = {};
          page.ID = 1;
          page.page = pageName;
          // updDataS('currentPage', page);
          resolve(response.text());
        }
      })
  })
}

function fetchTabTrans(recipe, headers) {
  return new Promise((resolve, reject) => {
    fetch(`${recipe.endPoint}getTabTranslation`, {
        method: recipe.type,
        body: headers,
      })
      .then(res => {
        if (res.status === 401) {
          reject(res.statusText)
        } else if (res.status === 500) {
          reject('Server Error: Unable to fetch Tabs')
        } else {
          return res.json()
        }
      })
      .then(resData => {
        if (!resData.length) {
          reject('No Tabs have been allocated for this page')
        } else {
          resolve(resData);
        }
      })
  })
}

function getAPIHeaders1() {
  return new Promise((resolve, reject) => {
    var authObj = {};
    getDataS('deviceProfile', 1)
      .then(function (deviceDets) {
        authObj["deviceUUID"] = deviceDets["deviceUUID"];
        getDataS('userProfile', 1)
          .then(function (profileDets) {
            authObj["HuserID"] = profileDets["HuserID"];
            authObj["currentUUID"] = profileDets["currentUUID"];
          }).then(() => {
            resolve(authObj);
          })
      }).catch(err => {
        reject(err)
      })
  });
}

function cfd(headers, obj) {
  return new Promise((resolve, reject) => {
    if (obj.constructor !== Object) {
      reject('There was an error parsing variables ')
    } else {
      const vars = {
        ...headers,
        ...obj
      };
      const nfd = new FormData();
      for (const key in vars) {
        if (vars.hasOwnProperty(key)) {
          (isNum(vars[key])) && (vars[key] = parseInt(vars[key]));
          nfd.append(key, vars[key]);
        }
      }
      resolve(nfd)
    }
  })
}

//*****************************************************//
// Core Engine Extras

const btnModalOn = eli => {
  const btn = id(eli)
  if (!btn.classList.contains('btnLoading')) {
    btn.classList.add('btnLoading')
    btn.disabled = true
    invisible('loadingText')
  }

};

const btnModalOff = eli => {
  const btn = id(eli)
  if (btn.classList.contains('btnLoading')) {
    btn.classList.remove('btnLoading')
    btn.disabled = false
    uninvisible('loadingText')
  }
};

const scroll = () => {
  window.scrollTo(0, 0)
};

const uuidvMain = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0,
      v = (c == 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const createCookie = (cKey, cValue) => {
  document.cookie = `${cKey}=${cValue};secure,`
};

const formatDate = date => {
  let d = new Date(date);
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  return [year, month, day].join('-');
}

const getCookie = cKey => {
  let name = cKey + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let cookie of ca) {
    let c = cookie;
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return parseInt(c.substring(name.length, c.length));
    }
  }
  return 0;
};

const errBox = msg => {
  const page = id('popupBox')
  page.innerHTML = '';
  const div = divAtt('div', 'class', 'popupMsg');
  const svg = divAtt('div', 'class', 'popIconErr');
  svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="83.7" height="83.8" viewBox="0 0 83.7 83.8"><g id="Layer_1-2" data-name="Layer 1-2"><path d="M41.9,0a41.9,41.9,0,1,0,41.8,41.9A41.82,41.82,0,0,0,41.9,0Zm15.4,61.9L41.9,46.55,26.5,62.05l-4.7-4.7,15.3-15.5L21.7,26.45l4.7-4.7,15.5,15.3,15.3-15.5,4.8,4.7L46.6,41.75l15.5,15.3Z" transform="translate(0 0.05)"/></g></svg>`
  const h = divAtt('h3', 'class', 'msgHeading');
  h.style.color = 'var(--errorColor)';
  h.innerHTML = 'Error';
  const p = divAtt('p', 'class', '');
  p.innerHTML = `${msg}`;
  const br = document.createElement('br');
  const btn = divAtt('button', 'class', 'errBtn');
  btn.setAttribute('onclick', `hide('popupBox')`);
  btn.style.width = '150px';
  btn.innerHTML = 'OK';
  const div2 = divAtt('div', 'class', 'overlay');

  div.appendChild(svg)
  div.appendChild(h)
  div.appendChild(p)
  div.appendChild(br)
  div.appendChild(btn)
  page.appendChild(div)
  page.appendChild(div2)
  unhide('popupBox')
};

const infoBox = msg => {
  const page = id('popupBox');
  page.innerHTML = '';
  const div = divAtt('div', 'class', 'popupMsg');
  div.style.borderColor = 'var(--primaryColor)';
  const svg = divAtt('div', 'class', 'popIconInfo');
  svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="83.38" height="83.38" viewBox="0 0 83.38 83.38"><path d="M41.85.16A41.69,41.69,0,1,0,83.54,41.85,41.68,41.68,0,0,0,41.85.16Zm.06,21a5.17,5.17,0,1,1-5.23,5.15A5.22,5.22,0,0,1,41.91,21.15Zm7.63,41.38q-7.68,0-15.36,0A2.56,2.56,0,0,1,31.51,60a2.6,2.6,0,0,1,2.71-2.61h2.4V41.84H34.31a2.59,2.59,0,1,1,0-5.17c3.26,0,6.52,0,9.78,0A2.62,2.62,0,0,1,47,39.57c0,5.6,0,11.21,0,16.81v1c.92,0,1.72,0,2.53,0A2.59,2.59,0,0,1,52.19,60,2.56,2.56,0,0,1,49.54,62.53Z" transform="translate(-0.16 -0.16)"/></svg>`
  const h = divAtt('h3', 'class', 'msgHeading');
  h.innerHTML = 'Information';
  const p = divAtt('p', 'class', '');
  p.innerHTML = `${msg}`;
  const br = document.createElement('br');
  const btn = divAtt('button', 'class', 'btn');
  btn.setAttribute('id', 'infoBoxBtn')
  btn.setAttribute('onclick', `hide('popupBox')`);
  btn.style.width = '150px';
  btn.innerHTML = 'OK';
  const div2 = divAtt('div', 'class', 'overlay');

  div.appendChild(svg)
  div.appendChild(h)
  div.appendChild(p)
  div.appendChild(br)
  div.appendChild(btn)
  page.appendChild(div)
  page.appendChild(div2)
  unhide('popupBox');
};

const custardBox = (html, heading) => {
  const page = id('custardContent')
  page.innerHTML = '';
  const h = divAtt('h3', 'class', 'custardHeading');
  h.innerHTML = heading;
  const content = divAtt('div', 'class', '')
  content.appendChild(html);
  page.appendChild(h)
  page.appendChild(content)
  unhide('custardBox');
};

const note = message => {
  const un = uuidvMain();
  const alertBanner = id('alertBanner');
  const msg = message ? `- ${message}` : '';
  const banner = divAtt('div', 'class', 'notification');
  banner.setAttribute('id', `banner_${un}`)
  const imgDiv = divAtt('div', 'class', 'noteIcon');
  imgDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25.2" height="25.2" viewBox="0 0 25.2 25.2"><path d="M13,.4A12.6,12.6,0,1,0,25.6,13,12.6,12.6,0,0,0,13,.4ZM10.9,18.9,5,13.3l1.5-1.6,4.4,4.2,8.6-8.8L21,8.6Z" transform="translate(-0.4 -0.4)"/></svg>`
  const msgHdr = divAtt('div', 'class', '');
  msgHdr.innerHTML = `<p><strong>Success</strong> ${msg}</p>`;
  msgHdr.style.marginRight = '10px';
  const btn = divAtt('div', 'onclick', `hide('banner_${un}')`);
  btn.innerHTML = '&#10005';
  btn.setAttribute('class', 'noteX');

  banner.appendChild(imgDiv)
  banner.appendChild(msgHdr)
  banner.appendChild(btn)
  alertBanner.appendChild(banner);

  setTimeout(() => {
    alertBanner.removeChild(banner);
  }, 6000)
};

const divAtt = (element, att, value) => {
  const div = document.createElement(element);
  if (att) {
    const attribute = document.createAttribute(att);
    attribute.value = value || '';
    div.setAttributeNode(attribute);
  }
  return div
};

const id = string => {
  return document.getElementById(string)
};


//*****************************************************//
// Initiating Session and client storage

const setDevProf = () => {
  if (getCookie('fgxkegwwkf') === '') {
    createCookie('fgxkegwwkf', uuidvMain())
  }
};

const idleStart = () => {

  const expire = 3600;
  const warning = 3300;
  let timer, currSeconds = 0;

  function resetTimer() {
    clearInterval(timer);
    currSeconds = 0;
    timer = setInterval(startIdleTimer, 1000);
  }
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer;
  window.ontouchstart = resetTimer;
  window.onclick = resetTimer;
  window.onkeypress = resetTimer;

  function startIdleTimer() {
    currSeconds++;
    if (currSeconds >= warning && currSeconds < expire) {
      const value = convertHMS(expire - currSeconds)
      infoBox(`Your session will expire due to inactivity in: ${value}`);
      id('infoBoxBtn').innerHTML = 'Back';
    }
    if (currSeconds === expire) {
      infoBox('Your session has expired. You will need to log back in to continue.');
      id('infoBoxBtn').setAttribute('onclick', 'logout(3)');
      id('infoBoxBtn').innerHTML = 'Logout';
      clearInterval(timer)
    }
  }
};

const initSession = () => {
  createCookie('ewttgpvwwkf', 0);
  createCookie('usrerId', 0);
  getCookie('mbohvbhfje') || createCookie('mbohvbhfje', 1);
  window.pageHist = new Map();
  window.pgstr = {};
  window.infoText = {};
  pageHist.set(5, '');
  pageHist.set(10, '');
  pageHist.set(15, '');
  pageHist.set(20, '');
};

