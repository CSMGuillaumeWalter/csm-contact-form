import { FranceMap } from './map.js';
import { ContactForm } from './form.js';

/**
 * Point d'entrée pour l'intégration Pimcore (brique Custom Html).
 * Les fichiers statiques doivent être déployés sous /static/france/fr_fr/contact-form/
 */
export async function mountCsmContactForm(root, options = {}) {
  if (!root) throw new Error('Conteneur formulaire introuvable');

  const {
    dataUrl = '/static/france/fr_fr/contact-form/data/commerciaux.json',
    configUrl = '/static/france/fr_fr/contact-form/data/form-config.json',
    svgUrl = '/static/france/fr_fr/contact-form/assets/fr.svg',
    submitUrl = '',
    recaptchaSiteKey = '',
  } = options;

  const [dataRes, configRes] = await Promise.all([
    fetch(dataUrl),
    fetch(configUrl).catch(() => null)
  ]);
  if (!dataRes.ok) throw new Error(`Impossible de charger ${dataUrl}`);
  const data = await dataRes.json();
  const config = configRes && configRes.ok ? await configRes.json().catch(() => null) : null;

  const mapHost = document.createElement('div');
  const map = new FranceMap(mapHost, data);
  map.defaultSvgUrl = svgUrl;

  const form = new ContactForm(root, data, map, { submitUrl, recaptchaSiteKey, config });

  map.callbacks.onRegionSelect = (info) => form.selectRegionOnMap(info);
  map.callbacks.onCommercialSelect = (info) => form.selectCommercialOnMap(info);

  const originalInit = map.init.bind(map);
  map.init = (url) => originalInit(url || svgUrl);

  form.init();
  return { form, map };
}
