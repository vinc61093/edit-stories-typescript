import { TemplateEntity, SelectedTemplateEntity } from '../../model';
import * as Cookies from 'es-cookie';

// aws
let newBaseURL = 'https://api-storiesedit.planoly.com/api/v1';
let planolyURL = 'https://api.planoly.com';

if (window.location.hostname.indexOf('staging') !== -1 || window.location.hostname.indexOf('localhost') !== -1) {
  newBaseURL = 'https://staging-api-storiesedit.planoly.com/api/v1';
  planolyURL = 'http://local-api.planoly.com';
}
else if (window.location.hostname.indexOf('preprod') !== -1) {
  newBaseURL = 'https://preprod-api-storiesedit.planoly.com/api/v1';
  planolyURL = 'https://preprod-api.planoly.com';
}

// local
// const newBaseURL = "https://staging-api-storiesedit.planoly.com/api/v1"

const fetchTemplatesAsync = (): Promise<TemplateEntity[]> => {
  const templateURL = `${newBaseURL}/get-template`;

  return fetch(templateURL, {
    method: 'POST'
  })
    .then((response) => (response.json()))
    .then(mapToTemplates);
};

const mapToTemplates = (templates: any[]): TemplateEntity[] => {
  return templates['data'].map(mapToTemplate);
};

const mapToTemplate = (template): TemplateEntity => {
  return {
    id: template.id,
    templateThumb: template.templateThumb
  };
};

const fetchSelectedTemplate = (id: number): Promise<any[]> => {
  const templateURL = `${newBaseURL}/get-template-by-id`;
  const file = new FormData();
  file.append("tempId", id.toString())
  return fetch(templateURL, {
    method: 'POST',
    body: file
  })
    .then((response) => (response.json()))
    .then(mapToSelectedTemplate);
}

const mapToSelectedTemplate = (selectedTemplate: any[]): SelectedTemplateEntity[] => {
  const template = Object.keys(selectedTemplate).map(i => selectedTemplate[i]);
  template.shift();
  template.shift();
  return template.map(mapToSelectedData);
}

const mapToSelectedData = (data): SelectedTemplateEntity => {
  return {
    id: data.id,
    template: data.template
  };
};

const downloadTemplate = (image): any => {
  const templateURL = `${newBaseURL}/resize`;
  const file = new FormData();
  file.append("imgBase64", image)
  return fetch(templateURL, {
    method: 'POST',
    body: file
  }).then((response) => (response.json()));
}

const fetchAccounts = async ():Promise<any[]> => {
  let authToken = Cookies.get('auth_token');
  let accounts: any[] = [];

  if (!authToken) {
    return accounts;
  }
  try {
    const response = await fetch(`${planolyURL}/accounts?fields=id,username,pic`, {      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    const json: any = await response.json();
    if (json._embedded && json._embedded.items) {
      accounts = json._embedded.items;
    }
  }
  catch (e) {
  }

  return accounts;
}

const sendToPlanoly = async (image, account): Promise<any> => {
  let authToken = Cookies.get('auth_token');
  try {
    const response = await fetch(`${planolyURL}/schedules?ig=${account.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        imageData: image,
        isStory: true,
        sortOrder: -1
      })
    });
    return response.json();
  }
  catch (e) {
    return null;
  }
}

export const memberAPI = {
  fetchTemplatesAsync,
  fetchSelectedTemplate,
  downloadTemplate,
  fetchAccounts,
  sendToPlanoly
};
