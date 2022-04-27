const dist = {
  landingPage: (recipe, hdrs, vars) => {
    SWITCHBOX(recipe, hdrs, vars)
      .then(() => {
        PREP('homePage');
        id('vursaLogo').src = `${imgDisplay}LogovursaLogiWhite.png`;

      })
      .catch(console.error())
  },
};

const authLogin = async () => {
  btnModalOn('loginBtn');
  setDevProf();
  const vars = {};
  vars.emailAddress = (id('l_username').value).trim();
  vars.passwordToAuthenticate = (id('l_password').value).trim();
  // vars.emailAddress = '';
  // vars.passwordToAuthenticate = '';

  PREP([mPUT(`${party}AuthenticateUser`)], vars)
    .then(async res => {

      if (res.data.AuthenticateUser) {
        btnModalOff('loginBtn');
        createCookie('usrerId', res.data['AuthenticateUser'].userId);

        await insertDiv('landingPage', 'primaryContainer');
      } else {
        errBox('Incorrect username or password');
        btnModalOff('loginBtn');
      }
      // console.log(res.data['AuthenticateUser'].userId)
      // createCookie('ewttgpvwwkf', data[0].CURRENTUUID);
      // createCookie('usrerId', res.data['AuthenticateUser'].userId);
      // createCookie('jwugtkf', data[0].HUSERID);
      // createCookie('mbohvbhfje', vars.languageID);

    }).catch(err => {
      console.log(err)
      btnModalOff('loginBtn');
    })

};

(async () => {

  //Initiate session
  initSession();

  // Login Page
  await insertDiv('login', 'primaryContainer');
  // Load Images
  id('logo').src = `${imgDisplay}VURSALogovursaLogoBlack.png`;
  id('coverImg').src = `${imgDisplay}loginImage.png`;


})();
