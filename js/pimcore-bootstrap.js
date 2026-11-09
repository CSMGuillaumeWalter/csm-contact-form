import { FranceMap } from './map.js';
import { ContactForm } from './form.js';

/**
 * Point d'entrée pour l'intégration Pimcore (brique Custom Html ou module ES).
 * Les fichiers statiques peuvent être déployés sous /static/france/fr_fr/contact-form/
 */
export async function mountCsmContactForm(root, options = {}) {
  if (!root) throw new Error('Conteneur formulaire introuvable');

  const dataset = root.dataset || {};
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

  const dataUrl = options.dataUrl || '/static/france/fr_fr/contact-form/data/commerciaux.json';
  const configUrl = options.configUrl || '/static/france/fr_fr/contact-form/data/form-config.json';
  const svgUrl = options.svgUrl || '/static/france/fr_fr/contact-form/assets/fr.svg';

  const web3formsKey = options.web3formsKey || dataset.web3formsKey || params.get('key') || params.get('web3forms_key') || params.get('access_key') || '30a6ee65-e232-4c5a-8c8c-4e7c9570872c';
  let submitUrl = options.submitUrl || dataset.submitUrl || params.get('submitUrl') || params.get('endpoint') || '';
  if (web3formsKey && !submitUrl) {
    submitUrl = 'https://api.web3forms.com/submit';
  }

  const recaptchaSiteKey = options.recaptchaSiteKey || dataset.recaptchaKey || dataset.recaptchaSiteKey || params.get('recaptchaKey') || '';
  const turnstileSiteKey = options.turnstileSiteKey || dataset.turnstileKey || dataset.turnstileSiteKey || params.get('turnstileKey') || '';
  const clientLookupUrl = options.clientLookupUrl || dataset.clientLookupUrl || params.get('clientLookupUrl') || '';

  const [dataRes, configRes] = await Promise.all([
    fetch(dataUrl).catch(() => null),
    fetch(configUrl, { cache: 'no-store' }).catch(() => null)
  ]);

  const data = (dataRes && dataRes.ok) ? await dataRes.json().catch(() => ({ regions: {} })) : { regions: {} };
  const config = (configRes && configRes.ok) ? await configRes.json().catch(() => null) : null;

  const mapHost = document.createElement('div');
  const map = new FranceMap(mapHost, data);
  map.defaultSvgUrl = svgUrl;

  const form = new ContactForm(root, data, map, {
    submitUrl,
    web3formsKey,
    recaptchaSiteKey,
    turnstileSiteKey,
    clientLookupUrl,
    config
  });

  map.callbacks.onRegionSelect = (info) => form.selectRegionOnMap(info);
  map.callbacks.onCommercialSelect = (info) => form.selectCommercialOnMap(info);

  const originalInit = map.init.bind(map);
  map.init = (url) => originalInit(url || svgUrl);

  form.init();
  return { form, map };
}
