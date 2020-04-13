const shadow = document.createElement('div')
const container = document.createElement('div')
const form = document.createElement('form')
const formTitle = document.createElement('div')
const formLogo = document.createElement('img')
const companyLabel = document.createElement('label')
const companyInput = document.createElement('input')
const jobTitleLabel = document.createElement('label')
const jobTitleInput = document.createElement('input')
const locationLabel = document.createElement('label')
const locationInput = document.createElement('input')
const jobPostUrlLabel = document.createElement('label')
const jobPostUrlInput = document.createElement('input')
const jobDescription = document.createElement('label')
const jobDescriptionInput = document.createElement('textarea')
const openButton = document.createElement('img')
const submitButton = document.createElement('button')
const closeButton = document.createElement('button')

shadow.setAttribute('id', 'shadowBox')
container.classList.add('form-popup')
container.setAttribute('id', 'myForm')
form.classList.add('form-container')
openButton.classList.add('open-button')
submitButton.classList.add('btn')
submitButton.setAttribute('id', 'saveJob')
closeButton.classList.add('btn')
closeButton.classList.add('cancel')
formTitle.setAttribute('id', 'formLogo')
formLogo.src = chrome.runtime.getURL('./images/logo.png')

companyLabel.setAttribute('for', 'company')
companyInput.setAttribute('type', 'text')
companyInput.setAttribute('placeholder', 'Company')
companyInput.setAttribute('name', 'company')
jobTitleLabel.setAttribute('for', 'jobTitle')
jobTitleInput.setAttribute('type', 'text')
jobTitleInput.setAttribute('placeholder', 'Job Title')
jobTitleInput.setAttribute('name', 'jobTitle')
locationLabel.setAttribute('for', 'location')
locationInput.setAttribute('type', 'text')
locationInput.setAttribute('placeholder', 'Location')
locationInput.setAttribute('name', 'location')
jobPostUrlLabel.setAttribute('for', 'postUrl')
jobPostUrlInput.setAttribute('type', 'text')
jobPostUrlInput.setAttribute('placeholder', 'Job Post Url')
jobPostUrlInput.setAttribute('name', 'postUrl')
jobDescription.setAttribute('for', 'description')
jobDescriptionInput.setAttribute('type', 'textarea')
jobDescriptionInput.setAttribute('placeholder', 'Description')
jobDescriptionInput.setAttribute('name', 'description')
submitButton.textContent = 'Add'
closeButton.textContent = 'Close'
openButton.src = chrome.extension.getURL("./images/icon48.png")
companyLabel.textContent = 'Company'
jobTitleLabel.textContent = 'Job Title'
jobPostUrlLabel.textContent = 'Job Post Url'
locationLabel.textContent = 'Location'
jobDescription.textContent = 'Description'

container.appendChild(form)
form.appendChild(formTitle)
formTitle.appendChild(formLogo)
form.appendChild(companyLabel)
form.appendChild(companyInput)
form.appendChild(jobTitleLabel)
form.appendChild(jobTitleInput)
form.appendChild(locationLabel)
form.appendChild(locationInput)
form.appendChild(jobPostUrlLabel)
form.appendChild(jobPostUrlInput)
form.appendChild(jobDescription)
form.appendChild(jobDescriptionInput)
form.appendChild(submitButton)
form.appendChild(closeButton)

window.document.body.appendChild(openButton)
window.document.body.appendChild(container)

const shadowRoot = container.attachShadow({mode: 'open'});
shadowRoot.innerHTML = `
<style>
body {font-family: Arial, Helvetica, sans-serif;}
* {box-sizing: border-box;}

#formLogo {
  display: flex;
  justify-content: center;
}
/* Button used to open the contact form - fixed at the bottom of the page */
.open-button {
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  display: block !important;
  z-index: 985696587451232547;
  /* width: 280px; */
}

/* The popup form - hidden by default */
.form-popup {
  display: none;
  position: fixed;
  bottom: 95px;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 999999999999;
}

/* Add styles to the form container */
.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
  z-index: 999999999999999;
}

/* Full-width input fields */
.form-container input[type=text], .form-container input[type=text] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}

.form-container textarea {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
  height: 60px;
  overflow-y: auto
}

/* When the inputs get focus, do something */
.form-container input[type=text]:focus, .form-container textarea:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/login button */
.form-container .btn {
  background-color: #08A6C9;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: #ddd;
  color: white;
  font-weight: 500;
}

/* Add some hover effects to buttons */
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}

</style>`
shadowRoot.appendChild(form)


chrome.storage.local.get('token', (res) => {
  if (!res.token) {
    openButton.setAttribute('style', 'display: none !important;')
  } else {
    openButton.setAttribute('style', 'display: block !important;')
  }
})

const setCompanyName = (company) => {
  if (company.href) {
    company.info = { company: company.textContent, companyUrl: company.href };
    return company.info;
  } else {
    company.name = company.textContent;
    return company.name;
  }
};

document.querySelector(".open-button").addEventListener("click", (event) => {
  event.preventDefault()
  const logo =
    document.querySelector('#vjs-img-cmL') ||
    document.querySelector('.vjs-JobInfoHeader-logo-container img') ||
    document.querySelector('.jobsearch-CompanyAvatar-image') ||
    null;
  const title =
    document.querySelector('#vjs-jobtitle') ||
    document.querySelector('.jobsearch-JobInfoHeader-title-container h3');
  const company =
    document.querySelector('#vjs-cn a') ||
    document.querySelector('#vjs-cn') ||
    document.querySelector('.icl-u-lg-mr--sm a') ||
    document.querySelector('.icl-u-lg-mr--sm');
  setCompanyName(company);
  const jobLocation =
    document.querySelector('#vjs-loc')

  const description =
    document.querySelector('#vjs-desc')

  chrome.storage.sync.get('url', function (result) {
    jobPostUrlInput.value = result.url
    jobTitleInput.value = title.textContent
    companyInput.value = company.info ? company.info.company : company.name
    locationInput.value = jobLocation.textContent
    jobDescriptionInput.value = description.textContent
  });
  container.style.display = "block";
})

shadowRoot.querySelector(".cancel").addEventListener("click", (event) => {
  event.preventDefault()
  container.style.display = "none";
})

shadowRoot.querySelector('#saveJob').addEventListener("click", (event) => {
  event.preventDefault()
  const logo =
  document.querySelector('#vjs-img-cmL') ||
  document.querySelector('.vjs-JobInfoHeader-logo-container img') ||
  document.querySelector('.jobsearch-CompanyAvatar-image') ||
  null;
const title =
  document.querySelector('#vjs-jobtitle') ||
  document.querySelector('.jobsearch-JobInfoHeader-title-container h3');
const company =
  document.querySelector('#vjs-cn a') ||
  document.querySelector('#vjs-cn') ||
  document.querySelector('.icl-u-lg-mr--sm a') ||
  document.querySelector('.icl-u-lg-mr--sm');
setCompanyName(company);
const jobLocation =
  document.querySelector('#vjs-loc')

const description =
  document.querySelector('#vjs-desc')

  chrome.storage.local.get('token', function (result) {
    chrome.storage.sync.get('url', function (res) {
    
    if (result.token === undefined) {
      return chrome.runtime.sendMessage({ type: 'getToken' });
    }

    const accessToken = result.token;

    const data = {
      jobTitle: title.textContent,
      urlText: res.url,
      logo: logo ? logo.src : null,
      companyTitle: company.info ? company.info.company : company.name,
      companyUrl: company.info ? company.info.companyUrl : null,
    };

    fetch('https://staging-save-this-job.herokuapp.com/users/addJob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === 'Jwt is expired') {
          return chrome.runtime.sendMessage({ type: 'getToken' });
        }
        if (data.message === 'Job Post Created') {
          return chrome.runtime.sendMessage({ type: 'jobSaveSuccess' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        chrome.runtime.sendMessage({ type: 'Error' });
      });
    })
  });
})

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'sendUrl') {
    chrome.storage.sync.set({ url: request.url }, () => {
      console.log('url', request.url)
    })
  }

  if (request.type === 'getTokenFromStorage') {
    if (
      window.location.href ===
      'https://staging.d3d1q8nq7a3fmz.amplifyapp.com/dashboard'
    ) {
      return setToken();
    }
  }
})

const setToken = () => {
  const token = localStorage.getItem('token');
  chrome.storage.local.set({ token }, () => {
    chrome.runtime.sendMessage({ type: 'tokenSet' });
  });
};

