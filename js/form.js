import {
  DEPARTEMENT_TO_REGION,
  REGION_LABELS,
  REGION_REPRESENTATIVE_POSTAL,
  getDepartementFromPostalCode,
  getRegionFromPostalCode,
} from './departements.js';

export const INTENTS = [
  {
    id: 'contact_commercial',
    icon: 'mapPin',
    label: 'Contacter un commercial',
    description: 'Être rappelé par le conseiller commercial CSM de votre secteur',
    steps: ['intent', 'infos', 'confirm'],
    infosFields: ['postal', 'coords', 'societe', 'profession', 'message'],
    messagePlaceholder: 'Précisez votre demande ou vos questions…',
  },
  {
    id: 'conseil_produit',
    icon: 'flask',
    label: 'Question produit, recette ou disponibilité',
    description: 'Fiche technique, disponibilité d\'un ingrédient, conseil d\'utilisation, recette',
    steps: ['intent', 'infos', 'confirm'],
    infosFields: ['message', 'product', 'coords', 'societe', 'postal', 'profession', 'attachments'],
    messagePlaceholder: 'Produit concerné, référence, recette, besoin spécifique…',
    attachments: {
      label: 'Photo, recette ou document',
      help: 'Photo produit, recette, étiquette… JPG, PNG ou PDF. 5 Mo max, 3 fichiers max.',
      accept: '.pdf,.jpg,.jpeg,.png,.webp',
      maxFiles: 3,
      maxSizeMb: 5,
    },
  },
  {
    id: 'proposition',
    icon: 'briefcase',
    label: 'Proposition commerciale',
    description: 'Fournisseur de matières premières, matériel ou prestation de service',
    steps: ['intent', 'infos', 'confirm'],
    infosFields: ['societe', 'client_type', 'pays', 'postal', 'nom', 'prenom', 'telephone', 'email', 'message'],
    messagePlaceholder: 'Nature de votre proposition, secteur, zone géographique…',
  },
  {
    id: 'candidature',
    icon: 'userPlus',
    label: 'Candidature spontanée',
    description: 'Rejoindre CSM Ingredients',
    steps: ['intent', 'infos', 'confirm'],
    infosFields: ['target_position', 'contract_type', 'nom', 'prenom', 'telephone', 'email', 'postal', 'message', 'attachments'],
    messagePlaceholder: 'Poste visé, mobilité, lien LinkedIn…',
    attachments: {
      label: 'CV, lettre de motivation, portfolio',
      help: 'CV obligatoire (PDF, DOC ou DOCX). Lettre et portfolio facultatifs (PDF ou TXT avec un lien). 5 Mo max, 3 fichiers max.',
      accept: '.pdf,.doc,.docx,.txt',
      maxFiles: 3,
      maxSizeMb: 5,
      required: true,
      requiredMessage: 'Joignez au moins votre CV.',
    },
  },
  {
    id: 'autre',
    icon: 'message',
    label: 'Autre demande',
    description: 'Qualité, livraison, réclamation, presse, partenariat ou questions diverses',
    steps: ['intent', 'infos', 'confirm'],
    infosFields: ['other_topic', 'societe', 'nom', 'prenom', 'telephone', 'email', 'postal', 'message', 'attachments'],
    messagePlaceholder: 'Détaillez votre demande (suivi qualité, livraison, réclamation, presse, questions diverses…)',
    attachments: {
      label: 'Photo, bon de livraison ou document',
      help: 'Photo du défaut, BL, étiquette lot, document… JPG, PNG, WEBP ou PDF. 5 Mo max, 3 fichiers max.',
      accept: '.pdf,.jpg,.jpeg,.png,.webp',
      maxFiles: 3,
      maxSizeMb: 5,
    },
  },
];

export const PROFESSIONS = [
  'Boulanger - Pâtissier',
  'Chaînés',
  'Professionnel de la Grande Distribution',
  'Distributeur',
  'Cash & Carry',
  'Industriel',
  'Centre de formation',
  'Particulier',
  'Autre',
];

const STEP_LABELS = {
  intent: 'Votre demande',
  infos: 'Vos informations',
  zone: 'Votre zone',
  confirm: 'Finalisation',
};

const ICON_SVG = {
  flask: '<path d="M9 3h6"/><path d="M10 3v5.4L5.6 16.2A3.2 3.2 0 0 0 8.4 21h7.2a3.2 3.2 0 0 0 2.8-4.8L14 8.4V3"/><path d="M8.2 14h7.6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/>',
  truck: '<path d="M1 7h13v10H1z"/><path d="M14 11h3.4L21 14.2V17h-7"/><circle cx="5.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  mapPin: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
  userPlus: '<path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="3.5"/><path d="M19 8v6"/><path d="M16 11h6"/>',
  message: '<path d="M21 12a8.4 8.4 0 0 1-12.2 7.4L3 21l1.7-4.7A8.4 8.4 0 1 1 21 12z"/>',
  messageFill: '<path d="M20 3H4a2 2 0 0 0-2 2v16l4.4-3.5H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.2 4.2 2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.12.9.32 1.8.6 2.6a2 2 0 0 1-.45 2.11L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.25a2 2 0 0 1 2.11-.45c.82.28 1.7.48 2.6.6A2 2 0 0 1 22 16.9z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
  chevronRight: '<path d="M9 18l6-6-6-6"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8.2 12.2l2.6 2.6 5-5.2"/>',
  headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 15a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v-5H4z"/><path d="M20 15h-1v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M12 21h2"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  paperclip: '<path d="M21.4 11.6 12.8 20.2a4.8 4.8 0 0 1-6.8-6.8l9.8-9.8a3.2 3.2 0 0 1 4.5 4.5l-9.8 9.8a1.6 1.6 0 0 1-2.3-2.3l9.1-9.1"/>',
  upload: '<path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  x: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01"/><path d="M12 7h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 15h.01"/><path d="M12 15h.01"/><path d="M16 15h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  alertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  helpCircle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
};

const SUBMIT_INTERVAL_KEY = 'csm-contact-last-submit';
const SUBMIT_INTERVAL_MS = 30000;
const SAVED_PROFILE_KEY = 'csm_client_profile';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function attr(value) {
  return escapeHtml(value);
}

function telHref(phone) {
  const cleaned = String(phone || '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '#';
}

function mailtoHref(email, subject = 'Demande CSM Ingredients') {
  const safe = String(email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) return '#';
  return `mailto:${safe}?subject=${encodeURIComponent(subject)}`;
}

function previewText(text, max = 140) {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

function icon(name, options = {}) {
  const inner = ICON_SVG[name];
  if (!inner) return '';
  if (options.filled) {
    return `<svg class="csm-icon csm-icon--filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${inner}</svg>`;
  }
  return `<svg class="csm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export class ContactForm {
  constructor(root, data, mapInstance, options = {}) {
    this.root = root;
    this.data = data;
    this.map = mapInstance;
    this.config = options.config || null;
    this.options = {
      submitUrl: options.submitUrl || '',
      web3formsKey: options.web3formsKey || options.accessKey || '',
      recaptchaSiteKey: options.recaptchaSiteKey || '',
      turnstileSiteKey: options.turnstileSiteKey || '',
      minSubmitIntervalMs: options.minSubmitIntervalMs ?? SUBMIT_INTERVAL_MS,
      clientLookupUrl: options.clientLookupUrl || options.config?.general?.clientLookupUrl || '',
      ...options,
    };
    this.stepDirection = 'forward';
    this._attachmentSeq = 0;
    this._panelAnimTimer = null;
    this._recaptchaReady = null;
    this._submitting = false;
    this.stepErrors = [];
    this.state = this.getInitialState();
  }

  applyTheme() {
    const theme = this.config?.theme;
    if (!theme) return;
    const r = document.documentElement;
    if (theme.primaryColor) r.style.setProperty('--csm-blue', theme.primaryColor);
    if (theme.primaryDark) r.style.setProperty('--csm-blue-dark', theme.primaryDark);
    if (theme.primarySoft) r.style.setProperty('--csm-blue-soft', theme.primarySoft);
    if (theme.secondaryColor) r.style.setProperty('--csm-green', theme.secondaryColor);
    if (theme.secondaryDark) r.style.setProperty('--csm-green-dark', theme.secondaryDark);
    if (theme.secondarySoft) r.style.setProperty('--csm-green-soft', theme.secondarySoft);
    if (theme.borderRadius) r.style.setProperty('--csm-radius', theme.borderRadius);
    if (theme.fontFamily) r.style.setProperty('--csm-font', theme.fontFamily);
  }

  getIntents() {
    if (this.config?.intents && Array.isArray(this.config.intents)) {
      return this.config.intents.filter((i) => i.enabled !== false);
    }
    return INTENTS;
  }

  // --- Profil client mémorisé (Solution 2 - LocalStorage) ---
  loadSavedProfile() {
    try {
      const raw = localStorage.getItem(SAVED_PROFILE_KEY);
      if (!raw) return null;
      const profile = JSON.parse(raw);
      if (profile && typeof profile === 'object') {
        const hasData = Object.entries(profile).some(([k, v]) => !['updatedAt', 'is_client'].includes(k) && String(v || '').trim().length > 0);
        return hasData ? profile : null;
      }
    } catch (e) {}
    return null;
  }

  applySavedProfile(profile) {
    if (!profile || typeof profile !== 'object') return;
    const keys = ['prenom', 'nom', 'telephone', 'email', 'societe', 'postalCode', 'profession', 'pays'];
    for (const k of keys) {
      if (profile[k] !== undefined && profile[k] !== null && String(profile[k]).trim() !== '') {
        this.state[k] = profile[k];
      }
    }
    if (profile.is_client !== undefined) {
      this.state.is_client = Boolean(profile.is_client);
    }
  }

  saveClientProfile() {
    try {
      const profile = {
        prenom: this.state.prenom || '',
        nom: this.state.nom || '',
        telephone: this.state.telephone || '',
        email: this.state.email || '',
        societe: this.state.societe || '',
        postalCode: this.state.postalCode || '',
        pays: this.state.pays || '',
        is_client: Boolean(this.state.is_client),
        profession: this.state.profession || '',
        updatedAt: new Date().toISOString()
      };
      const hasData = Object.entries(profile).some(([k, v]) => !['updatedAt', 'is_client'].includes(k) && String(v || '').trim().length > 0);
      if (hasData) {
        localStorage.setItem(SAVED_PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (e) {}
  }

  clearSavedProfile() {
    try {
      localStorage.removeItem(SAVED_PROFILE_KEY);
    } catch (e) {}
    this.state.prenom = '';
    this.state.nom = '';
    this.state.telephone = '';
    this.state.email = '';
    this.state.societe = '';
    this.state.postalCode = '';
    this.state.pays = '';
    this.state.client_type = '';
    this.state.is_client = false;
    this.render();
  }

  renderSavedProfileBanner() {
    // Le badge mémorisé est désormais positionné directement à côté du libellé d'étape (Étape 2 / 3 · Vos informations)
    return '';
  }

  // --- Contacts commerciaux disponibles pour rappel ---

  getAvailableCallbackContacts() {
    if (this.state.panelView === 'industrie') {
      return this.getIndustryContacts();
    }
    if (this.state.panelContacts && this.state.panelContacts.length > 0) {
      return this.state.panelContacts;
    }
    if (this.state.assignedRegion?.id) {
      return this.getMapContactsForRegion(this.state.assignedRegion.id);
    }
    return this.state.assignedContact ? [this.state.assignedContact] : [];
  }

  selectCommercialForCallback(contactId) {
    const available = this.getAvailableCallbackContacts();
    let found = available.find((c) => String(c.id) === String(contactId));
    if (!found) {
      found = this.getIndustryContacts().find((c) => String(c.id) === String(contactId));
    }
    if (!found) {
      for (const region of Object.values(this.data.regions || {})) {
        found = region.contacts?.find((c) => String(c.id) === String(contactId));
        if (found) break;
      }
    }

    if (found) {
      this.state.assignedContact = found;
      this.state.callbackCommercialChoice = String(found.id);
      if (!this.state.assignedRegion?.id) {
        for (const [rId, reg] of Object.entries(this.data.regions || {})) {
          if (reg.contacts?.some((c) => String(c.id) === String(found.id))) {
            this.state.assignedRegion = { id: rId, name: reg.name };
            break;
          }
        }
      }
    } else {
      this.state.callbackCommercialChoice = 'any';
    }

    this.state.contactMode = 'callback';
    this.stepDirection = 'forward';
    const steps = this.getStepIds();
    const confirmIdx = steps.indexOf('confirm');
    this.state.step = confirmIdx >= 0 ? confirmIdx : this.state.step + 1;
    this.stepErrors = [];
    this.render();
    this.scrollToFormTop();
  }

  getAttachmentConfig() {
    const fromIntent = this.getIntentConfig()?.attachments;
    if (fromIntent) return fromIntent;
    const defaultIntent = INTENTS.find((i) => i.id === this.state.intent);
    if (defaultIntent?.attachments) return defaultIntent.attachments;
    if (this.state.intent === 'candidature') {
      return {
        label: 'CV obligatoire & lettre de motivation',
        help: 'CV obligatoire (PDF, DOC ou DOCX). Lettre ou portfolio facultatifs. 5 Mo max, 3 fichiers max.',
        accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
        maxFiles: 3,
        maxSizeMb: 5,
        required: true,
        requiredMessage: 'Veuillez joindre votre CV (PDF ou Word) pour postuler.',
      };
    }
    if (this.state.intent === 'qualite_livraison' || this.state.intent === 'autre') {
      return {
        label: 'Photo, bon de livraison ou document',
        help: 'Photo du défaut, BL, étiquette lot ou document… JPG, PNG, WEBP ou PDF. 5 Mo max, 3 fichiers max.',
        accept: '.pdf,.jpg,.jpeg,.png,.webp',
        maxFiles: 3,
        maxSizeMb: 5,
      };
    }
    return {
      label: 'Photo, recette ou document',
      help: 'Photo produit, recette, étiquette… JPG, PNG ou PDF. 5 Mo max, 3 fichiers max.',
      accept: '.pdf,.jpg,.jpeg,.png,.webp',
      maxFiles: 3,
      maxSizeMb: 5,
    };
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  isAllowedAttachment(file, cfg) {
    const allowed = cfg.accept.split(',').map((part) => part.trim().toLowerCase()).filter(Boolean);
    const name = file.name.toLowerCase();
    const ext = name.includes('.') ? `.${name.split('.').pop()}` : '';
    return allowed.some((token) => {
      if (token.startsWith('.')) return ext === token;
      return file.type === token;
    });
  }

  validateAttachmentFile(file, cfg) {
    const maxBytes = cfg.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `« ${file.name} » dépasse ${cfg.maxSizeMb} Mo.`;
    }
    if (!this.isAllowedAttachment(file, cfg)) {
      return `« ${file.name} » : format non accepté.`;
    }
    return null;
  }

  validateAttachments() {
    const cfg = this.getAttachmentConfig();
    if (!cfg) return null;
    if (cfg.required && this.state.attachments.length === 0) {
      return cfg.requiredMessage || 'Joignez au moins un fichier.';
    }
    if (this.state.attachments.length > cfg.maxFiles) {
      return `Maximum ${cfg.maxFiles} fichier${cfg.maxFiles > 1 ? 's' : ''}.`;
    }
    for (const entry of this.state.attachments) {
      const error = this.validateAttachmentFile(entry.file, cfg);
      if (error) return error;
    }
    return null;
  }

  addAttachmentFiles(fileList) {
    const cfg = this.getAttachmentConfig();
    if (!cfg || !fileList?.length) return null;

    for (const file of fileList) {
      if (this.state.attachments.length >= cfg.maxFiles) {
        return `Maximum ${cfg.maxFiles} fichier${cfg.maxFiles > 1 ? 's' : ''}.`;
      }
      const duplicate = this.state.attachments.some(
        (entry) =>
          entry.file.name === file.name &&
          entry.file.size === file.size &&
          entry.file.lastModified === file.lastModified
      );
      if (duplicate) continue;

      const error = this.validateAttachmentFile(file, cfg);
      if (error) return error;

      this._attachmentSeq += 1;
      this.state.attachments.push({ id: String(this._attachmentSeq), file });
    }
    return null;
  }

  removeAttachment(id) {
    this.state.attachments = this.state.attachments.filter((entry) => entry.id !== id);
  }

  isCommercialIntent() {
    return this.state.intent === 'contact_commercial';
  }

  scrollToFormTop() {
    const wizardBody = this.root.querySelector('.csm-wizard__body');
    if (wizardBody && wizardBody.scrollHeight > wizardBody.clientHeight) {
      wizardBody.scrollTop = 0;
    }
    const card = this.root.querySelector('.csm-modal, .csm-contact-form') || this.root;
    if (card) {
      const rect = card.getBoundingClientRect();
      if (rect.top < 15 || window.scrollY > 50) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  selectIntent(intentId) {
    this.stepDirection = 'forward';
    if (this.state.intent !== intentId) {
      this.state.intent = intentId;
      this.state.contactMode = 'callback';
      this.state.callbackCommercialChoice = 'any';
      this.state.panelView = 'terrain';
      this.state.attachments = [];
    }
    this.state.step = 1;
    this.stepErrors = [];
    this.render();
    this.scrollToFormTop();
  }

  getSubmitLabel() {
    if (this.isCommercialIntent()) {
      return 'Demander à être rappelé';
    }
    return 'Envoyer ma demande';
  }

  getSubmitIcon() {
    return 'send';
  }

  init() {
    this.applyTheme();
    const saved = this.loadSavedProfile();
    if (saved) {
      this.applySavedProfile(saved);
    }
    this.render();
    this.ensureRecaptcha();
  }

  getInitialState() {
    return {
      step: 0,
      intent: null,
      message: '',
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      postalCode: '',
      pays: '',
      societe: '',
      profession: '',
      professionAutre: '',
      productInterest: '',
      commande: '',
      lot: '',
      is_client: false,
      urgency_level: 'normal',
      product_family: [],
      delivery_date: '',
      target_position: '',
      contract_type: '',
      other_topic: '',
      animation_theme: '',
      client_type: '',
      newsletter_optin: false,
      consent: true,
      assignedContact: null,
      assignedRegion: null,
      panelContacts: [],
      panelView: 'terrain',
      contactMode: 'callback',
      callbackCommercialChoice: 'any',
      attachments: [],
    };
  }

  renderHoneypot() {
    return `
      <div class="csm-hp" aria-hidden="true">
        <label for="csm-website">Site web</label>
        <input type="text" id="csm-website" name="website" tabindex="-1" autocomplete="off" />
      </div>`;
  }

  renderCaptchaBadge() {
    return `
      <span class="csm-saved-badge csm-saved-badge--captcha" role="status" title="Protection anti-robot automatique active (Conforme RGPD)">
        <span class="csm-saved-badge__check" aria-hidden="true">${icon('shield')}</span>
        <span class="csm-saved-badge__text">Protection anti-robot</span>
        <span class="csm-captcha-status-dot" title="Protection active"></span>
      </span>
      <div id="csm-turnstile-container" class="csm-turnstile-hidden-slot" aria-hidden="true"></div>`;
  }

    renderConsentField() {
    return `
      <div class="csm-confirm-consent-box">
        <span class="csm-confirm-consent-box__icon">${icon('shield')}</span>
        <div class="csm-confirm-consent-box__content">
          <span>En validant votre demande ci-dessous, vous acceptez notre <a href="https://www.csmingredients.com/france/fr_fr/generals/politique-de-confidentialite" target="_blank" rel="noopener">politique de confidentialité</a>. Vos coordonnées sont utilisées exclusivement par CSM Ingredients pour traiter votre demande.</span>
        </div>
      </div>`;
  }

  ensureRecaptcha() {
    const key = this.options.recaptchaSiteKey;
    if (!key) return Promise.resolve(false);
    if (window.grecaptcha?.execute) return Promise.resolve(true);
    if (this._recaptchaReady) return this._recaptchaReady;

    this._recaptchaReady = new Promise((resolve) => {
      const existing = document.querySelector('script[data-csm-recaptcha]');
      const onReady = () => {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(() => resolve(true));
        } else {
          resolve(Boolean(window.grecaptcha?.execute));
        }
      };
      if (existing) {
        if (window.grecaptcha) onReady();
        else existing.addEventListener('load', onReady, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
      script.async = true;
      script.dataset.csmRecaptcha = '1';
      script.onload = onReady;
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
    return this._recaptchaReady;
  }

  async getRecaptchaToken() {
    const key = this.options.recaptchaSiteKey;
    if (!key) return '';
    const ready = await this.ensureRecaptcha();
    if (!ready || !window.grecaptcha?.execute) return '';
    try {
      return await window.grecaptcha.execute(key, { action: 'contact' });
    } catch {
      return '';
    }
  }

  isRateLimited() {
    try {
      const last = Number(sessionStorage.getItem(SUBMIT_INTERVAL_KEY) || 0);
      return last > 0 && Date.now() - last < this.options.minSubmitIntervalMs;
    } catch {
      return false;
    }
  }

  markSubmitTime() {
    try {
      sessionStorage.setItem(SUBMIT_INTERVAL_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  generateConfirmationEmail() {
    const intentId = this.state.intent || 'autre';
    const fullName = `${this.state.prenom || ''} ${this.state.nom || ''}`.trim() || 'Madame, Monsieur';
    const company = this.state.societe ? ` (${this.state.societe})` : '';
    const cp = (this.state.postalCode || '').trim();
    const dept = getDepartementFromPostalCode(cp);
    const regId = getRegionFromPostalCode(cp) || this.state.assignedRegion?.id || '';
    const regName = regId ? (REGION_LABELS[regId] || this.state.assignedRegion?.name || regId) : (this.state.assignedRegion?.name || '');
    const locationStr = regName ? `${regName}${dept ? ` (Département ${dept})` : ''}` : (cp ? `CP ${cp}` : '');

    let subject = '';
    let introLead = '';
    let treatmentInfo = '';
    const specificDetails = [];

    switch (intentId) {
      case 'contact_commercial':
        subject = '[CSM Ingredients France] Confirmation de votre demande de rappel commercial';
        introLead = `Nous vous confirmons la bonne réception de votre demande de mise en relation avec le conseiller commercial CSM Ingredients de votre secteur${locationStr ? ` (${locationStr})` : ''}.`;
        treatmentInfo = 'Votre conseiller commercial prendra contact avec vous directement par téléphone sous 24 à 48h ouvrées pour faire le point sur vos besoins et vous accompagner.';
        if (this.state.telephone) specificDetails.push(`Téléphone de rappel : ${this.state.telephone}`);
        if (locationStr) specificDetails.push(`Secteur géographique : ${locationStr}`);
        break;

      case 'conseil_produit':
        subject = '[CSM Ingredients France] Confirmation : Votre question technique / recette';
        introLead = 'Nous accusons réception de votre demande d\'information technique concernant nos ingrédients, recettes ou disponibilités produits.';
        treatmentInfo = 'Nos experts techniques et conseillers culinaires étudient votre question avec soin. Une réponse complète vous sera adressée par e-mail ou par téléphone sous 24 à 48h ouvrées.';
        if (this.state.productInterest) specificDetails.push(`Produit ou recette : ${this.state.productInterest}`);
        break;

      case 'proposition':
        subject = '[CSM Ingredients France] Confirmation : Réception de votre proposition commerciale';
        introLead = 'Nous vous remercions pour l\'intérêt que vous portez à CSM Ingredients France et confirmons la réception de votre proposition.';
        treatmentInfo = 'Votre offre a été transmise aux services concernés. Nos équipes reviendront vers vous par e-mail ou par téléphone.';
        if (this.state.other_topic) specificDetails.push(`Sujet de la proposition : ${this.state.other_topic}`);
        break;

      case 'candidature':
        subject = '[CSM Ingredients France] Confirmation de réception de votre candidature';
        introLead = 'Nous vous remercions pour l\'intérêt que vous portez à CSM Ingredients France et vous confirmons la bonne réception de votre candidature spontanée.';
        treatmentInfo = 'Notre équipe Ressources Humaines étudie votre profil avec attention. Si une opportunité correspond à vos compétences et aspirations, nous ne manquerons pas de vous contacter par e-mail ou par téléphone.';
        if (this.state.target_position) specificDetails.push(`Poste visé : ${this.state.target_position}`);
        if (this.state.contract_type) specificDetails.push(`Type de contrat : ${this.getContractTypeLabel()}`);
        break;

      case 'autre':
      default:
        subject = '[CSM Ingredients France] Confirmation de réception de votre message';
        introLead = 'Nous vous confirmons la bonne réception de votre message transmis via notre formulaire de contact.';
        treatmentInfo = 'Notre équipe étudie votre demande et vous apportera une réponse personnalisée par e-mail ou téléphone sous 24 à 48h ouvrées.';
        if (this.state.other_topic) specificDetails.push(`Sujet : ${this.state.other_topic}`);
        break;
    }

    const clientMsg = (this.state.message || '').trim();

    const textLines = [
      `Bonjour ${fullName},`,
      '',
      introLead,
      '',
      `ℹ️ ${treatmentInfo}`,
      '',
      '==================================================',
      'RÉCAPITULATIF DE VOTRE DEMANDE',
      '==================================================',
      `Demandeur : ${fullName}${company}`,
      `E-mail    : ${this.state.email || 'Non renseigné'}`,
      `Téléphone : ${this.state.telephone || 'Non renseigné'}`,
      ...specificDetails,
      '',
      clientMsg ? `Votre message :\n« ${clientMsg} »` : '(Demande transmise sans message additionnel)',
      '==================================================',
      '',
      'Pour toute urgence ou question complémentaire, notre service client reste à votre disposition :',
      '📞 Numéro Vert gratuit : 0 800 616 816 (du lundi au vendredi)',
      '✉️ E-mail : info.france@csmingredients.com',
      '🌐 Site web : https://www.csmingredients.com/france',
      '',
      'Cordialement,',
      'L\'équipe CSM Ingredients France'
    ];

    const bodyText = textLines.join('\n');

    const detailsRowsHtml = specificDetails.map((d) => {
      const parts = d.split(' : ');
      return `<p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>${parts[0]} :</strong> ${parts[1] || ''}</p>`;
    }).join('');

    const bodyHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background-color: #007cbd; padding: 24px 32px; text-align: left;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.2px;">CSM Ingredients France</h1>
      <p style="color: #e0f2fe; margin: 6px 0 0 0; font-size: 13px;">Accusé de réception de votre demande</p>
    </div>
    <div style="padding: 32px;">
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Bonjour ${fullName},</p>
      <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">${introLead}</p>
      
      <div style="background-color: #eef6fb; border-left: 4px solid #007cbd; padding: 14px 18px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #0369a1; font-weight: 500;">
          ℹ️ ${treatmentInfo}
        </p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Récapitulatif de votre demande</h3>
        <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Contact :</strong> ${fullName}${company}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>E-mail :</strong> ${this.state.email || 'Non renseigné'}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Téléphone :</strong> ${this.state.telephone || 'Non renseigné'}</p>
        ${detailsRowsHtml}
        ${clientMsg ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">VOTRE MESSAGE :</p><p style="margin: 0; font-size: 14px; font-style: italic; color: #334155;">« ${clientMsg.replace(/\n/g, '<br/>')} »</p></div>` : ''}
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 24px;">
        <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">Besoin d\'une assistance immédiate ?</p>
        <p style="font-size: 14px; margin: 0 0 4px 0;">📞 <strong>Numéro Vert gratuit :</strong> <a href="tel:0800616816" style="color: #007cbd; text-decoration: none;">0 800 616 816</a> (du lundi au vendredi)</p>
        <p style="font-size: 14px; margin: 0;">✉️ <strong>E-mail :</strong> <a href="mailto:info.france@csmingredients.com" style="color: #007cbd; text-decoration: none;">info.france@csmingredients.com</a></p>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">CSM Ingredients France — <a href="https://www.csmingredients.com/france" style="color: #007cbd; text-decoration: none;" target="_blank">www.csmingredients.com</a></p>
    </div>
  </div>
</body>
</html>`.trim();

    return {
      subject,
      text: bodyText,
      html: bodyHtml,
      to: this.state.email || '',
      intentId,
      treatmentInfo
    };
  }

    buildFormData(recaptchaToken = '') {
    const payload = new FormData();
    const web3formsKey = this.options.web3formsKey || this.options.accessKey || '';
    const fullName = `${this.state.prenom || ''} ${this.state.nom || ''}`.trim() || 'Client CSM';

    // Résolution robuste et directe du secteur géographique via le code postal
    const cp = (this.state.postalCode || '').trim();
    const dept = getDepartementFromPostalCode(cp);
    const regId = getRegionFromPostalCode(cp) || this.state.assignedRegion?.id || '';
    const regName = regId ? (REGION_LABELS[regId] || this.state.assignedRegion?.name || regId) : (this.state.assignedRegion?.name || '');
    if (regId && (!this.state.assignedRegion || !this.state.assignedRegion.name)) {
      this.state.assignedRegion = { id: regId, name: regName, dept: dept || '' };
    }

    const isCommercial = this.isCommercialIntent();
    const clientCompany = this.state.societe ? `${this.state.societe} - ` : '';

    // 1. Objet de l'e-mail clair et percutant
    let emailSubject = '';
    if (isCommercial) {
      const locationTag = regName ? `[${regName}${dept ? ` - ${dept}` : ''}] ` : (cp ? `[CP ${cp}] ` : '');
      emailSubject = `[CSM France] 📞 Rappel commercial ${locationTag}: ${clientCompany}${fullName}`;
    } else {
      const intentLabel = this.getIntentConfig()?.label || 'Demande de contact';
      emailSubject = `[CSM France] ${intentLabel} : ${clientCompany}${fullName}`;
    }

    // 2. Synthèse lisible à 100% dans le corps principal (Message)
    const regionDisplay = regName
      ? `${regName}${dept ? ` (Département ${dept} - CP ${cp})` : ` (CP ${cp})`}`
      : (cp ? `Code Postal ${cp}` : 'Non précisé');

    const summaryLines = [
      '==================================================',
      isCommercial ? 'DEMANDE DE RAPPEL COMMERCIAL - CSM INGREDIENTS' : 'NOUVELLE DEMANDE DE CONTACT - CSM INGREDIENTS',
      '==================================================',
      '',
      `📍 SECTEUR / ZONE : ${regionDisplay}`,
      `👤 CONTACT        : ${fullName}`,
      this.state.societe ? `🏢 SOCIÉTÉ        : ${this.state.societe}` : null,
      this.state.profession ? `💼 PROFESSION     : ${this.getProfessionLabel()}` : null,
      `📞 TÉLÉPHONE      : ${this.state.telephone || 'Non renseigné'}`,
      `✉️ E-MAIL         : ${this.state.email || 'Non renseigné'}`,
      this.state.client_type ? `🏷️ ÉTABLISSEMENT  : ${this.state.client_type}` : null,
      this.state.is_client ? `⭐ STATUT         : Déjà client CSM` : null,
      '',
      '--- MESSAGE DU CLIENT ---',
      (this.state.message || '').trim() || '(Aucun message saisi - Demande de rappel direct)',
      '',
      '--------------------------------------------------',
      `Abonnement communications CSM : ${this.state.newsletter_optin ? 'OUI' : 'NON'}`,
      '=================================================='
    ].filter(Boolean).join('\n');

    // 3. Configuration Web3Forms
    if (web3formsKey) {
      payload.append('access_key', web3formsKey);
      payload.append('from_name', 'CSM Ingredients France');
      if (this.state.email) {
        payload.append('email', this.state.email);
        payload.append('replyto', this.state.email);
      }
      payload.append('subject', emailSubject);
    }

    // 4. Message unique et auto-suffisant pour l'équipe interne CSM
    payload.append('message', summaryLines);

    // 5. Modèle d'e-mail de confirmation (Accusé de réception adapté au motif pour le client)
    const confMail = this.generateConfirmationEmail();
    if (this.state.email) {
      payload.append('confirmation_to', this.state.email);
      payload.append('confirmation_subject', confMail.subject);
      payload.append('confirmation_body', confMail.text);
      payload.append('confirmation_html', confMail.html);
      payload.append('motif_id', this.state.intent || '');
      payload.append('motif_label', this.getIntentConfig()?.label || '');
    }

    // 6. Anti-bot & Captcha
    payload.append('botcheck', '');
    if (recaptchaToken) payload.append('recaptchaToken', recaptchaToken);

    if (this.state.attachments && this.state.attachments.length > 0) {
      payload.append('pieces_jointes', this.state.attachments.map((a) => a.file.name).join(', '));
      this.state.attachments.forEach((entry, index) => {
        const fieldKey = index === 0 ? 'attachment' : `attachment_${index}`;
        payload.append(fieldKey, entry.file, entry.file.name);
      });
    }

    return payload;
  }

  presentSubmitError(message) {
    this.stepErrors = [{ field: null, message }];
    const form = this.root.querySelector('.csm-contact-form');
    if (form) this.syncErrorUI(form, { focus: false });
  }

  getIntentConfig() {
    return this.getIntents().find((i) => i.id === this.state.intent) || INTENTS.find((i) => i.id === this.state.intent);
  }

  getStepIds() {
    return this.getIntentConfig()?.steps || ['intent'];
  }

  getCurrentStepId() {
    const steps = this.getStepIds();
    return steps[Math.min(this.state.step, steps.length - 1)];
  }

  stepHasField(field) {
    const cfg = this.getIntentConfig();
    const stepId = this.getCurrentStepId();
    if (stepId === 'infos') {
      if (cfg?.fields) return cfg.fields.includes(field);
      return cfg?.infosFields?.includes(field);
    }
    if (stepId === 'zone') {
      if (cfg?.fields) return cfg.fields.includes(field);
      return cfg?.zoneFields?.includes(field);
    }
    return false;
  }

  isChefDesVentes(contact) {
    if (!contact) return false;
    return contact.role === 'chef_des_ventes' || (contact.fonction || '').toLowerCase().includes('chef');
  }

  isTerrainMapContact(contact) {
    return contact.showOnMap !== false && contact.role !== 'industrie';
  }

  getTerrainContactsForRegion(regionId) {
    const region = this.data.regions[regionId];
    if (!region) return [];
    const regular = region.contacts.filter((c) => c.role === 'commercial' && c.showOnMap !== false);
    if (regular.length > 0) return regular;
    // Si la région n'a plus de commercial, afficher le Chef des ventes :
    return region.contacts.filter(
      (c) => this.isChefDesVentes(c) && c.showOnMap !== false
    );
  }

  getMapContactsForRegion(regionId) {
    return this.getTerrainContactsForRegion(regionId);
  }

  getIndustryContacts() {
    const seen = new Set();
    const contacts = [];

    Object.values(this.data.regions).forEach((region) => {
      region.contacts.forEach((contact) => {
        const isInd = contact.role === 'industrie' || (contact.fonction || '').toLowerCase().includes('industrie');
        if (!isInd || contact.showInContactForm === false || seen.has(contact.id)) {
          return;
        }
        // L'équipe industrie ne comporte que Florent
        if (contact.prenom.toLowerCase().includes('florent') || contact.nom.toLowerCase().includes('riverola')) {
          seen.add(contact.id);
          contacts.push(contact);
        }
      });
    });

    return contacts;
  }

  getIndustryGroups() {
    const all = this.getIndustryContacts();
    return {
      main: all,
      grandsComptes: [],
      gms: [],
    };
  }

  findCommercialsForPostalCode(postalCode) {
    const dept = getDepartementFromPostalCode(postalCode);
    const fallbackRegionId = getRegionFromPostalCode(postalCode);
    const coveringOnMap = [];

    if (dept) {
      Object.entries(this.data.regions).forEach(([regionId, region]) => {
        const regularCommercials = (region.contacts || []).filter(
          (c) => c.showOnMap !== false && c.role === 'commercial'
        );
        const hasRegular = regularCommercials.length > 0;

        region.contacts.forEach((contact) => {
          if (!this.isTerrainMapContact(contact)) return;
          // Dans les régions avec des commerciaux terrain, on ne matche pas le chef
          if (hasRegular && this.isChefDesVentes(contact)) return;
          if (!contact.departements?.includes(dept)) return;

          coveringOnMap.push({ ...contact, regionId, regionName: region.name });
        });
      });
    }

    if (coveringOnMap.length) {
      const suggestedContact = coveringOnMap[0];
      return {
        regionId: suggestedContact.regionId,
        regionName: suggestedContact.regionName,
        mapContacts: this.getMapContactsForRegion(suggestedContact.regionId),
        suggestedContact,
      };
    }

    if (!fallbackRegionId) {
      return { regionId: null, mapContacts: [], suggestedContact: null };
    }

    const region = this.data.regions[fallbackRegionId];
    const mapContacts = region ? this.getMapContactsForRegion(fallbackRegionId) : [];
    return {
      regionId: fallbackRegionId,
      regionName: region?.name || REGION_LABELS[fallbackRegionId] || 'France',
      mapContacts,
      suggestedContact: mapContacts[0] || null,
    };
  }

  syncPostalInput() {
    const input = this.root.querySelector('[name="postalCode"]');
    if (input && input.value !== this.state.postalCode) {
      input.value = this.state.postalCode;
    }
  }

  setPostalFromContact(contact) {
    if (!contact?.codePostal) return;
    this.state.postalCode = String(contact.codePostal);
    this.syncPostalInput();
  }

  setPostalForRegion(regionId, contact = null) {
    if (contact?.codePostal) {
      const dept = getDepartementFromPostalCode(contact.codePostal);
      if (dept && DEPARTEMENT_TO_REGION[dept] === regionId) {
        this.state.postalCode = String(contact.codePostal);
        this.syncPostalInput();
        return;
      }
    }
    const repPostal = REGION_REPRESENTATIVE_POSTAL[regionId];
    if (repPostal) {
      this.state.postalCode = String(repPostal);
      this.syncPostalInput();
    }
  }

  updateZoneFromPostalCode() {
    const code = (this.state.postalCode || '').trim();
    if (!/^\d{5}$/.test(code)) {
      this.state.assignedRegion = null;
      this.state.panelContacts = [];
      this.state.assignedContact = null;
      this.map?.resetHighlight();
      this.syncPostalBadge();
      this.refreshContactPanel();
      return;
    }

    const dept = getDepartementFromPostalCode(code);
    const fallbackRegionId = getRegionFromPostalCode(code);
    const regName = fallbackRegionId ? (REGION_LABELS[fallbackRegionId] || fallbackRegionId) : '';

    if (fallbackRegionId) {
      this.state.assignedRegion = {
        id: fallbackRegionId,
        name: regName,
        dept: dept || ''
      };
    } else {
      this.state.assignedRegion = null;
    }

    this.syncPostalBadge();
    this.refreshContactPanel();
    this.clearErrorFields('infos', 'postalCode');
    this.clearErrorFields('zone', 'postalCode');
  }

  syncPostalBadge() {
    const badgeEl = this.root.querySelector('#postal-feedback-badge');
    if (!badgeEl) return;
    const detected = this.state.assignedRegion;
    if (detected && detected.name) {
      const deptPart = detected.dept ? ` (${detected.dept})` : '';
      badgeEl.innerHTML = `<span class="csm-postal-feedback__badge" style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 10px;background:#e8f6ec;color:#1e7538;border-radius:20px;font-size:0.85rem;font-weight:600;"><span style="color:#2e9a4c;">✓</span> Secteur ${escapeHtml(detected.name)}${deptPart}</span>`;
    } else {
      badgeEl.innerHTML = '';
    }
  }

  selectRegionOnMap(info) {
    this.state.panelContacts = info.mapContacts;
    this.state.assignedRegion = { id: info.regionId, name: info.regionName };
    const primary = info.mapContacts.find((c) => c.codePostal) || info.mapContacts[0] || null;
    this.state.assignedContact = primary;
    this.setPostalForRegion(info.regionId);
    this.refreshContactPanel();
    this.clearErrorFields('zone', 'postalCode');
  }

  orderContactsBySelection(contacts) {
    const selectedId = this.state.assignedContact?.id;
    if (!contacts?.length || !selectedId) return contacts || [];
    const selected = contacts.filter((contact) => contact.id === selectedId);
    const others = contacts.filter((contact) => contact.id !== selectedId);
    return [...selected, ...others];
  }

  selectCommercialOnMap(info) {
    this.state.assignedContact = info.contact;
    this.state.assignedRegion = { id: info.regionId, name: info.regionName };
    this.state.panelContacts = this.orderContactsBySelection(this.getMapContactsForRegion(info.regionId));
    this.setPostalForRegion(info.regionId, info.contact);
    this.refreshContactPanel();
    this.clearErrorFields('zone', 'postalCode');
  }

  setPanelView(view) {
    if (view === this.state.panelView) return;

    this.state.panelView = view;
    if (view === 'industrie') {
      const principal = this.getIndustryContacts().find((c) => c.industrieProfil === 'principal');
      if (principal) this.state.assignedContact = principal;
    }

    const section = this.root.querySelector('.csm-map-section');
    if (section) {
      section.classList.remove('csm-map-section--view-terrain', 'csm-map-section--view-industrie');
      section.classList.add(`csm-map-section--view-${view}`);
      section.querySelector('.csm-map-layer--terrain')?.setAttribute('aria-hidden', String(view !== 'terrain'));
      section.querySelector('.csm-map-layer--industrie')?.setAttribute('aria-hidden', String(view !== 'industrie'));
    }

    const directPanel = this.root.querySelector('.csm-contact-mode__panel--direct');
    if (directPanel) {
      directPanel.classList.remove('csm-contact-mode__panel--view-terrain', 'csm-contact-mode__panel--view-industrie');
      directPanel.classList.add(`csm-contact-mode__panel--view-${view}`);
      directPanel.querySelector('.csm-mode-layer--terrain')?.setAttribute('aria-hidden', String(view !== 'terrain'));
      directPanel.querySelector('.csm-mode-layer--industrie')?.setAttribute('aria-hidden', String(view !== 'industrie'));
    }

    this.syncPanelSwitchers();
  }

  refreshContactPanel() {
    const body = this.root.querySelector('#terrain-contact-panel-body');
    if (body) {
      body.innerHTML = this.renderTerrainPanelBody();
    }
  }

  syncPanelSwitchers() {
    this.root.querySelectorAll('[data-action="panel-view"]').forEach((button) => {
      const active = button.dataset.view === this.state.panelView;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  renderTerrainPanelBody() {
    const contacts = this.state.panelContacts;
    const regionName = this.state.assignedRegion?.name;

    if (contacts?.length) {
      const hasChef = contacts.some((c) => this.isChefDesVentes(c));
      const sectionLabel = hasChef ? 'Responsable régional' : 'Commerciaux terrain';
      return `
        <div class="csm-contact-panel__section csm-contact-panel__section--terrain">
          <div class="csm-contact-panel__header">
            <p class="csm-contact-card__label">${sectionLabel}</p>
            <p class="csm-contact-panel__count">${attr(regionName || 'Région')} · ${contacts.length} sur la carte</p>
          </div>
          <ul class="csm-contact-panel__list">
            ${contacts.map((contact) => `<li>${this.renderContactCardCompact(contact)}</li>`).join('')}
          </ul>
        </div>`;
    }

    return `
      <div class="csm-contact-panel__section csm-contact-panel__section--terrain csm-contact-panel__section--empty">
        <div class="csm-contact-panel__empty">
          ${icon('mapPin')}
          <p class="csm-contact-form__hint">Saisissez votre code postal ou cliquez sur une région de la carte.</p>
        </div>
      </div>`;
  }

  collectStepErrors() {
    const errors = [];
    const add = (field, message) => errors.push({ field, message });
    const stepId = this.getCurrentStepId();
    const cfg = this.getIntentConfig();

    switch (stepId) {
      case 'intent':
        if (!this.state.intent) add('intent', 'Choisissez un motif de contact.');
        break;
      case 'infos': {
        const activeFields = cfg?.fields || cfg?.infosFields || [];
        if (activeFields.includes('target_position') && !this.state.target_position?.trim()) {
          add('target_position', 'Indiquez le métier ou poste recherché.');
        }
        if (activeFields.includes('contract_type') && !this.state.contract_type?.trim()) {
          add('contract_type', 'Sélectionnez un type de contrat.');
        }
        if (activeFields.includes('other_topic') && !this.state.other_topic?.trim()) {
          add('other_topic', 'Indiquez le sujet de votre demande.');
        }
        if (activeFields.includes('nom') && !this.state.nom?.trim()) {
          add('nom', 'Indiquez votre nom.');
        }
        if (activeFields.includes('prenom') && !this.state.prenom?.trim()) {
          add('prenom', 'Indiquez votre prénom.');
        }
        if (activeFields.includes('telephone') && !this.state.telephone?.trim()) {
          add('telephone', 'Indiquez un numéro de téléphone.');
        }
        if (activeFields.includes('email') && (!this.state.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email))) {
          add('email', 'Indiquez une adresse e-mail valide.');
        }
        const isCommercial = this.isCommercialIntent();
        if (activeFields.includes('message') && !isCommercial && !this.state.message?.trim()) {
          add('message', 'Décrivez votre demande.');
        }
        if (cfg.infosFields?.includes('coords')) {
          if (!this.state.prenom.trim()) add('prenom', 'Indiquez votre prénom.');
          if (!this.state.nom.trim()) add('nom', 'Indiquez votre nom.');
          if (!this.state.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
            add('email', 'Indiquez une adresse e-mail valide.');
          }
        }
        if (cfg.infosFields?.includes('commande') && !this.state.commande.trim() && !this.state.lot.trim()) {
          add('commande', 'Indiquez le n° de commande ou le n° de lot.');
          add('lot', 'Indiquez le n° de commande ou le n° de lot.');
        }
        if ((cfg.infosFields?.includes('postal') || activeFields.includes('postal')) && !/^\d{5}$/.test(this.state.postalCode)) {
          add('postalCode', 'Indiquez votre code postal.');
        }
        if (cfg.infosFields?.includes('profession') || activeFields.includes('profession')) {
          if (!this.state.profession) add('profession', 'Sélectionnez votre profession.');
          else if (this.state.profession === 'Autre' && !this.state.professionAutre.trim()) {
            add('professionAutre', 'Précisez votre profession.');
          }
        }
        {
          const attachmentError = this.validateAttachments();
          if (attachmentError) add('attachments', attachmentError);
        }
        break;
      }
      case 'zone':
        if (this.state.panelView !== 'industrie' && !this.state.panelContacts.length && !/^\d{5}$/.test(this.state.postalCode)) {
          add('zone', 'Indiquez votre code postal ou cliquez sur une région.');
        }
        break;
      case 'confirm':
        this.state.contactMode = 'callback';
        this.state.consent = true;
        {
          const attachmentError = this.validateAttachments();
          if (attachmentError) add('attachments', attachmentError);
        }
        break;

      default:
        break;
    }
    return errors;
  }

  validateCurrentStep() {
    return this.collectStepErrors()[0]?.message || null;
  }

  getErrorTargets(form, field) {
    if (!form || !field) return [];
    switch (field) {
      case 'intent':
        return [...form.querySelectorAll('.csm-intent-grid')];
      case 'contactMode':
        return [...form.querySelectorAll('.csm-contact-mode__choices')];
      case 'consent':
        return [...form.querySelectorAll('.csm-field--checkbox')];
      case 'attachments':
        return [...form.querySelectorAll('.csm-field--attachments')];
      case 'zone':
        return [...form.querySelectorAll('.csm-zone-search-header, .csm-map-container')];
      default: {
        let control = form.querySelector(`[name="${field}"]`);
        if (!control && field === 'postalCode') control = form.querySelector('[name="postal"]');
        if (!control && field === 'postal') control = form.querySelector('[name="postalCode"]');
        if (!control) return [];
        const wrap = control.closest('.csm-field') || control.closest('.csm-zone-search-header') || control.closest('.csm-zone-intro');
        return wrap ? [wrap] : [control];
      }
    }
  }

  clearFieldErrorMarks(form) {
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    form.querySelectorAll('[aria-invalid]').forEach((el) => {
      el.removeAttribute('aria-invalid');
      if (el.getAttribute('aria-describedby') === 'form-error') {
        el.removeAttribute('aria-describedby');
      }
    });
  }

  applyFieldErrors(form, { focus = false } = {}) {
    this.clearFieldErrorMarks(form);
    let focused = false;
    for (const { field } of this.stepErrors) {
      for (const target of this.getErrorTargets(form, field)) {
        target.classList.add('is-invalid');
        const control = target.matches('input, select, textarea')
          ? target
          : target.querySelector('input, select, textarea');
        if (!control) continue;
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-describedby', 'form-error');
        if (focus && !focused) {
          control.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          focused = true;
        }
      }
    }
  }

  syncErrorUI(form, { focus = false } = {}) {
    const errorEl = form.querySelector('#form-error');
    if (errorEl) errorEl.textContent = this.stepErrors[0]?.message || '';
    this.applyFieldErrors(form, { focus });
    return this.stepErrors.length > 0;
  }

  presentStepErrors(form) {
    this.stepErrors = this.collectStepErrors();
    return this.syncErrorUI(form, { focus: true });
  }

  clearErrorFields(...fields) {
    const before = this.stepErrors.length;
    this.stepErrors = this.stepErrors.filter((err) => !fields.includes(err.field));
    if (this.stepErrors.length === before) return;
    const form = this.root.querySelector('.csm-contact-form');
    if (form) this.syncErrorUI(form, { focus: false });
  }

  clearControlError(el) {
    if (!el) return;
    const name = el.getAttribute('name');
    if (name === 'commande' || name === 'lot') {
      if (this.state.commande.trim() || this.state.lot.trim()) {
        this.clearErrorFields('commande', 'lot');
      }
      return;
    }
    const fields = (name === 'postalCode' || name === 'postal') ? ['postalCode', 'postal', 'zone'] : name ? [name] : [];
    if (fields.length) this.clearErrorFields(...fields);
  }

  isTechnicoCommercial(contact) {
    return contact.fonction === 'Technico-commercial';
  }

  getContactRoleKind(contact) {
    if (contact.role === 'industrie') return 'industrie';
    if (this.isChefDesVentes(contact)) return 'chef';
    return this.isTechnicoCommercial(contact) ? 'technico' : 'terrain';
  }

  renderContactCardCompact(contact, options = {}) {
    const isResponsable = this.isChefDesVentes(contact);
    const isTechnico = this.isTechnicoCommercial(contact);
    const isGC = contact.industrieProfil === 'grands_comptes';
    const isGMS = contact.industrieProfil === 'gms';
    const isPrincipal = contact.industrieProfil === 'principal' || contact.role === 'industrie';

    let defaultBadge = '';
    let badgeKind = 'commercial';

    if (isPrincipal) {
      defaultBadge = 'Contact principal';
      badgeKind = 'principal';
    } else if (isGC) {
      defaultBadge = 'Grands comptes';
      badgeKind = 'grands-comptes';
    } else if (isGMS) {
      defaultBadge = 'GMS';
      badgeKind = 'gms';
    } else if (isResponsable) {
      defaultBadge = 'Responsable régional';
      badgeKind = 'responsable';
    } else if (isTechnico) {
      defaultBadge = 'Technico-commercial';
      badgeKind = 'technico';
    } else {
      defaultBadge = 'Commercial';
      badgeKind = 'commercial';
    }

    const badge = options.badge || defaultBadge;
    const roleKind = isResponsable ? 'responsable' : (isTechnico ? 'technico' : 'terrain');
    const roleClass = roleKind ? ` csm-contact-card--${roleKind}` : '';
    const featuredClass = (isPrincipal || isResponsable) ? ' csm-contact-card--featured' : '';
    const profilClass = isResponsable ? ' csm-contact-card--chef' : (isGC ? ' csm-contact-card--grands-comptes' : (isGMS ? ' csm-contact-card--gms' : ''));

    const rawFonction = contact.fonction || defaultBadge;
    const isDuplicate = badge && rawFonction.trim().toLowerCase() === badge.trim().toLowerCase();
    const displayFonction = isDuplicate ? (contact.specialite || '') : [rawFonction, contact.specialite].filter(Boolean).join(' · ');

    return `
      <article class="csm-contact-card csm-contact-card--compact${roleClass}${featuredClass}${profilClass}" data-contact-id="${contact.id}">
        <div class="csm-contact-card__top">
          <p class="csm-contact-card__name">${attr(contact.prenom)} ${attr(contact.nom)}</p>
        </div>
        ${(badge || displayFonction) ? `
          <div class="csm-contact-card__meta-row">
            ${badge ? `<span class="csm-contact-card__badge csm-contact-card__badge--${badgeKind}">${badge}</span>` : ''}
            ${displayFonction ? `<span class="csm-contact-card__fonction">${attr(displayFonction)}</span>` : ''}
          </div>` : ''}
        <div class="csm-contact-card__actions-row">
          ${contact.telephone ? `
            <a class="csm-action-btn csm-action-btn--tel" href="${telHref(contact.telephone)}" title="Appeler ${attr(contact.prenom)} ${attr(contact.nom)}">
              ${icon('phone')} <span>${attr(contact.telephone)}</span>
            </a>` : ''}
          ${contact.email ? `
            <a class="csm-action-btn csm-action-btn--email csm-action-btn--icon" href="${mailtoHref(contact.email)}" title="Envoyer un e-mail à ${attr(contact.prenom)} ${attr(contact.nom)} (${attr(contact.email)})" aria-label="Envoyer un e-mail à ${attr(contact.prenom)} ${attr(contact.nom)}">
              ${icon('mail')}
            </a>` : ''}
          <button type="button" class="csm-btn-callback-cta" data-action="request-callback" data-contact-id="${contact.id}" title="Demander un rappel">
            ${icon('headset')} <span>Être rappelé</span>
          </button>
        </div>
      </article>`;
  }

  renderPanelSwitcher() {
    if (!this.getIndustryContacts().length) return '';

    const isTerrain = this.state.panelView === 'terrain';
    const isIndustrie = this.state.panelView === 'industrie';

    return `
      <div class="csm-panel-switcher" role="tablist" aria-label="Type d'activité">
        <button type="button" class="csm-panel-switcher__btn ${isTerrain ? 'is-active' : ''}" data-action="panel-view" data-view="terrain" role="tab" aria-selected="${isTerrain}">
          ${icon('mapPin')} Artisan
        </button>
        <button type="button" class="csm-panel-switcher__btn ${isIndustrie ? 'is-active' : ''}" data-action="panel-view" data-view="industrie" role="tab" aria-selected="${isIndustrie}">
          ${icon('briefcase')} Industrie
        </button>
      </div>`;
  }

  renderIndustryGroup(title, contacts, extraClass = '') {
    if (!contacts.length) return '';
    return `
      <section class="csm-industrie-group ${extraClass}">
        <p class="csm-industrie-group__title">${title}</p>
        <ul class="csm-contact-panel__list csm-contact-panel__list--industrie">
          ${contacts.map((contact) => `<li>${this.renderContactCardCompact(contact)}</li>`).join('')}
        </ul>
      </section>`;
  }

  renderIndustryPanelContent() {
    const contacts = this.getIndustryContacts();
    if (!contacts.length) {
      return `
        <div class="csm-industrie-sheet csm-industrie-sheet--empty">
          <p class="csm-contact-form__hint">Contact industrie indisponible pour le moment.</p>
        </div>`;
    }

    return `
      <div class="csm-industrie-sheet">
        <div class="csm-industrie-sheet__switcher-header">
          <p class="csm-switcher-note">Vous êtes un artisan ou point de vente ?</p>
          ${this.renderPanelSwitcher()}
        </div>
        <div class="csm-industrie-sheet__header">
          <p class="csm-contact-card__label">Interlocuteur Industrie National</p>
          <p class="csm-contact-panel__count">Projets industriels & grands comptes · France entière</p>
        </div>
        <div class="csm-industrie-layout csm-industrie-layout--single">
          <div class="csm-industrie-group csm-industrie-group--main">
            <ul class="csm-contact-panel__list csm-contact-panel__list--industrie">
              ${contacts.map((contact) => `<li>${this.renderContactCardCompact(contact, { badge: 'Expert Industrie' })}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>`;
  }

  renderIndustryDirectList() {
    const { main, grandsComptes, gms } = this.getIndustryGroups();
    return `
      ${main.length ? `
        <p class="csm-contact-mode__panel-title">Industrie</p>
        ${this.renderDirectContactList(main)}` : ''}
      ${grandsComptes.length ? `
        <p class="csm-contact-mode__panel-subtitle">Grands comptes</p>
        ${this.renderDirectContactList(grandsComptes)}` : ''}
      ${gms.length ? `
        <p class="csm-contact-mode__panel-subtitle">GMS</p>
        ${this.renderDirectContactList(gms)}` : ''}`;
  }

  renderDirectModeLayers(regionLabel) {
    return `
      <div class="csm-mode-stage">
        <div class="csm-mode-layer csm-mode-layer--terrain" aria-hidden="${this.state.panelView !== 'terrain'}">
          <p class="csm-contact-mode__panel-title">Commerciaux terrain · ${attr(regionLabel)}</p>
          ${this.renderDirectContactList(this.state.panelContacts)}
        </div>
        <div class="csm-mode-layer csm-mode-layer--industrie" aria-hidden="${this.state.panelView !== 'industrie'}">
          <p class="csm-contact-mode__panel-title">Industrie</p>
          ${this.renderIndustryDirectList()}
        </div>
      </div>`;
  }

  renderAttachmentField() {
    const cfg = this.getAttachmentConfig();
    if (!cfg || !this.stepHasField('attachments')) return '';

    const remaining = cfg.maxFiles - this.state.attachments.length;

    return `
      <div class="csm-field csm-field--attachments">
        <label for="attachments">${cfg.label} ${cfg.required ? '<span aria-hidden="true">*</span>' : '<span class="csm-optional">(facultatif)</span>'}</label>
        <p class="csm-field__help">${cfg.help}</p>
        ${remaining > 0 ? `
          <div class="csm-attachment-drop">
            <input type="file" id="attachments" name="attachments" multiple accept="${cfg.accept}" />
            <span class="csm-attachment-drop__label">${icon('upload')} Choisir un fichier</span>
          </div>` : `
          <p class="csm-field__help">Nombre maximum de fichiers atteint.</p>`}
        ${this.state.attachments.length ? `
          <ul class="csm-attachment-list" aria-live="polite">
            ${this.state.attachments
              .map(
                (entry) => `
              <li class="csm-attachment-item">
                <span class="csm-attachment-item__icon">${icon('paperclip')}</span>
                <span class="csm-attachment-item__name">${attr(entry.file.name)}</span>
                <span class="csm-attachment-item__size">${this.formatFileSize(entry.file.size)}</span>
                <button type="button" class="csm-attachment-item__remove" data-action="remove-attachment" data-id="${entry.id}" aria-label="Retirer ${attr(entry.file.name)}">
                  ${icon('x')}
                </button>
              </li>`
              )
              .join('')}
          </ul>` : ''}
      </div>`;
  }

  renderProfessionField(id = 'profession') {
    const showAutre = this.state.profession === 'Autre';
    return `
      <div class="csm-field">
        <label for="${id}">Profession <span aria-hidden="true">*</span></label>
        <select id="${id}" name="profession" required>
          <option value="">Sélectionnez…</option>
          ${PROFESSIONS.map((p) => `<option value="${p}" ${this.state.profession === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
      <div class="csm-field csm-field--followup" data-field="professionAutre" ${showAutre ? '' : 'hidden'}>
        <label for="professionAutre">Précisez <span aria-hidden="true">*</span></label>
        <input type="text" id="professionAutre" name="professionAutre" value="${attr(this.state.professionAutre)}" placeholder="Votre métier ou fonction" ${showAutre ? 'required' : ''} autocomplete="organization-title" />
      </div>`;
  }

  renderSocieteField() {
    return `
      <div class="csm-field">
        <label for="societe">Nom de l'établissement <span class="csm-optional">(facultatif)</span></label>
        <input type="text" id="societe" name="societe" autocomplete="organization" value="${attr(this.state.societe)}" placeholder="Ex. Boulangerie Dupont" />
      </div>`;
  }

  renderCommandeFields() {
    return `
      <div class="csm-commande-block">
        <div class="csm-field-row">
          <div class="csm-field">
            <label for="commande">N° de commande</label>
            <input type="text" id="commande" name="commande" value="${attr(this.state.commande)}" placeholder="Ex. 452187" />
          </div>
          <div class="csm-field">
            <label for="lot">N° de lot</label>
            <input type="text" id="lot" name="lot" value="${attr(this.state.lot)}" placeholder="Ex. L24-0891" />
          </div>
        </div>
        <p class="csm-field__help">Indiquez au moins le n° de commande ou le n° de lot.</p>
      </div>`;
  }

  getProfessionLabel() {
    if (!this.state.profession) return '';
    if (this.state.profession === 'Autre' && this.state.professionAutre.trim()) {
      return `Autre : ${this.state.professionAutre.trim()}`;
    }
    return this.state.profession;
  }

  syncProfessionAutreField() {
    const wrap = this.root.querySelector('[data-field="professionAutre"]');
    const input = this.root.querySelector('[name="professionAutre"]');
    const show = this.state.profession === 'Autre';
    if (!wrap || !input) return;
    wrap.hidden = !show;
    input.toggleAttribute('required', show);
    if (!show) {
      input.value = '';
      this.state.professionAutre = '';
    }
  }

  renderDirectContactList(contacts) {
    if (!contacts?.length) {
      return '<p class="csm-contact-form__hint">Sélectionnez d\'abord votre zone à l\'étape précédente.</p>';
    }

    return `
      <ul class="csm-direct-list">
        ${contacts
          .map((contact) => {
            const roleKind = this.getContactRoleKind(contact);
            return `
          <li>
            <article class="csm-direct-card${roleKind ? ` csm-direct-card--${roleKind}` : ''}">
              <div class="csm-direct-card__info">
                <p class="csm-contact-card__name">${attr(contact.prenom)} ${attr(contact.nom)}</p>
                <p class="csm-contact-card__fonction">${attr(contact.fonction || 'Commercial')}${contact.specialite ? ` · ${attr(contact.specialite)}` : ''}</p>
              </div>
              <div class="csm-direct-card__actions">
                ${contact.telephone ? `<a class="csm-btn csm-btn--secondary csm-btn--compact" href="${telHref(contact.telephone)}">${icon('phone')} Appeler</a>` : ''}
                ${contact.email ? `<a class="csm-btn csm-btn--primary csm-btn--compact" href="${mailtoHref(contact.email)}" title="Envoyer un e-mail à ${attr(contact.prenom)} ${attr(contact.nom)} (${attr(contact.email)})">${icon('mail')} Écrire</a>` : ''}
              </div>
            </article>
          </li>`;
          })
          .join('')}
      </ul>`;
  }

  renderRecapRow(iconName, label, value) {
    if (!value) return '';
    return `<p class="csm-confirm-recap__row">${icon(iconName)} <span><strong>${label} :</strong> ${escapeHtml(value)}</span></p>`;
  }

  renderConfirmRecap() {
    const cfg = this.getIntentConfig();
    const fullName = [this.state.prenom, this.state.nom].filter(Boolean).join(' ');
    const contactParts = [fullName, this.state.email, this.state.telephone].filter(Boolean);
    const messagePreview = previewText(this.state.message);

    let attachmentsText = '';
    if (this.state.attachments.length) {
      const count = this.state.attachments.length;
      const names = this.state.attachments.map((entry) => entry.file.name).join(', ');
      attachmentsText = `${count} fichier${count > 1 ? 's' : ''}${names ? ` · ${previewText(names, 80)}` : ''}`;
    } else if (this.getAttachmentConfig() && !this.getAttachmentConfig().required) {
      attachmentsText = 'Aucune';
    }

    const zoneLabel =
      this.state.assignedRegion?.name && this.state.postalCode
        ? `${this.state.postalCode} · ${this.state.assignedRegion.name}`
        : this.state.postalCode || this.state.assignedRegion?.name || '';

    return `
      <div class="csm-confirm-recap">
        ${this.renderRecapRow(cfg?.icon, 'Motif', cfg?.label)}
        ${zoneLabel ? this.renderRecapRow('mapPin', 'Zone', zoneLabel) : ''}
        ${this.renderRecapRow('user', 'Contact', contactParts.join(' · '))}
        ${this.state.societe ? this.renderRecapRow('building', 'Établissement', this.state.societe) : ''}
        ${this.state.client_type ? this.renderRecapRow('briefcase', "Type d'établissement", this.state.client_type) : ''}
        ${this.state.pays ? this.renderRecapRow('globe', 'Pays', this.state.pays) : ''}
        ${this.state.other_topic ? this.renderRecapRow('message', 'Sujet', this.state.other_topic) : ''}
        ${this.state.target_position ? this.renderRecapRow('userPlus', 'Poste visé', this.state.target_position) : ''}
        ${this.state.contract_type ? this.renderRecapRow('fileText', 'Type de contrat', this.getContractTypeLabel()) : ''}
        ${this.renderRecapRow('briefcase', 'Profession', this.getProfessionLabel())}
        ${this.state.productInterest ? this.renderRecapRow('flask', 'Produit', this.state.productInterest) : ''}
        ${this.state.commande ? this.renderRecapRow('truck', 'Commande', this.state.commande) : ''}
        ${this.state.lot ? this.renderRecapRow('paperclip', 'Lot', this.state.lot) : ''}
        ${messagePreview ? `
        <div class="csm-confirm-recap__message">
          <p class="csm-confirm-recap__message-label">${icon('message')} Votre message</p>
          <blockquote class="csm-confirm-recap__message-text">${escapeHtml(messagePreview)}</blockquote>
        </div>` : ''}
        ${attachmentsText ? this.renderRecapRow('paperclip', 'Pièces jointes', attachmentsText) : ''}
        <p class="csm-confirm-recap__hint">Vérifiez ces éléments avant l'envoi.</p>
      </div>`;
  }

  getContractTypeLabel() {
    if (!this.state.contract_type) return '';
    const map = {
      'cdi-cdd': 'CDI/CDD',
      'interim': 'Intérim',
      'stage-alternance': 'Stage/Alternance',
    };
    return map[this.state.contract_type] || this.state.contract_type;
  }

  getSlotLabel(slotId) {
    const map = {
      morning: 'Matin (8h - 12h)',
      noon: 'Midi (12h - 14h)',
      afternoon: 'Après-midi (14h - 18h)',
      indifferent: 'Indifférent / Dès que possible'
    };
    return map[slotId] || slotId;
  }

  renderCommercialConfirm() {
    const regionName = this.state.assignedRegion?.name;
    const availableContacts = this.getAvailableCallbackContacts();
    const hasMultipleContacts = availableContacts.length > 1;

    let targetHtml = '';
    if (hasMultipleContacts) {
      targetHtml = `
        <div class="csm-callback-target">
          <div class="csm-callback-target__header">
            <span class="csm-callback-target__badge">
              ${icon('headset')} Demande de rappel commercial
            </span>
            <div class="csm-callback-target__actions">
              ${regionName ? `<span class="csm-callback-target__region">${icon('mapPin')} ${attr(regionName)}</span>` : ''}
              <button type="button" class="csm-btn-edit-callback" data-action="edit-commercial" title="Modifier le secteur ou la carte">
                ${icon('refresh')} <span>Modifier</span>
              </button>
            </div>
          </div>

          <div class="csm-callback-choice-box">
            <p class="csm-callback-choice-heading">
              Interlocuteur souhaité pour votre rappel :
            </p>
            <div class="csm-callback-choices-grid" role="radiogroup" aria-label="Choix du commercial à rappeler">
              ${availableContacts.map((c) => {
                const isSelected = String(this.state.callbackCommercialChoice) === String(c.id);
                const roleText = [c.fonction || 'Commercial', c.specialite].filter(Boolean).join(' · ');
                return `
                  <label class="csm-callback-choice ${isSelected ? 'is-selected' : ''}">
                    <input type="radio" name="callbackCommercialChoice" value="${attr(c.id)}" ${isSelected ? 'checked' : ''} />
                    <span class="csm-callback-choice__indicator" aria-hidden="true"></span>
                    <span class="csm-callback-choice__content">
                      <span class="csm-callback-choice__name">${attr(c.prenom)} ${attr(c.nom)}</span>
                      <span class="csm-callback-choice__role">${attr(roleText)}</span>
                    </span>
                  </label>
                `;
              }).join('')}

              <label class="csm-callback-choice csm-callback-choice--any ${String(this.state.callbackCommercialChoice) === 'any' ? 'is-selected' : ''}">
                <input type="radio" name="callbackCommercialChoice" value="any" ${String(this.state.callbackCommercialChoice) === 'any' ? 'checked' : ''} />
                <span class="csm-callback-choice__indicator" aria-hidden="true"></span>
                <span class="csm-callback-choice__content">
                  <span class="csm-callback-choice__name">Être rappelé par n'importe quel commercial de ce secteur</span>
                  <span class="csm-callback-choice__role">Premier interlocuteur disponible pour traiter ma demande</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      const contact = availableContacts[0] || this.state.assignedContact;
      targetHtml = `
        <div class="csm-callback-target">
          <div class="csm-callback-target__header">
            <span class="csm-callback-target__badge">
              ${icon('headset')} Demande de rappel commercial
            </span>
            <div class="csm-callback-target__actions">
              ${regionName ? `<span class="csm-callback-target__region">${icon('mapPin')} ${attr(regionName)}</span>` : ''}
              <button type="button" class="csm-btn-edit-callback" data-action="edit-commercial" title="Modifier le commercial ou le secteur">
                ${icon('refresh')} <span>Modifier</span>
              </button>
            </div>
          </div>
          <div class="csm-callback-target__contact">
            ${contact ? `
              <span class="csm-callback-target__label">Interlocuteur :</span>
              <strong>${attr(contact.prenom)} ${attr(contact.nom)}</strong>
              <span class="csm-callback-target__role">(${attr(contact.fonction || 'Commercial')}${regionName ? ` · ${attr(regionName)}` : ''})</span>
            ` : `
              <strong>Commercial CSM Ingredients France</strong>
              <span class="csm-callback-target__role">(${attr(regionName || 'Votre secteur')})</span>
            `}
          </div>
        </div>
      `;
    }

    return `
      <section class="csm-callback-section">
        ${targetHtml}

        <div class="csm-step-stack" style="margin-top: 1.25rem;">
          ${this.renderSavedProfileBanner()}
          <div class="csm-field">
            <label for="message">Votre message ou précision <span class="csm-field-hint">(facultatif)</span></label>
            <textarea id="message" name="message" rows="3" placeholder="Précisez votre besoin, vos questions, ou laissez vide pour un simple rappel…">${attr(this.state.message)}</textarea>
          </div>
          <div class="csm-field-row">
            ${this.renderSocieteField()}
            <div class="csm-field">
              <label for="postalCodeCallback">Département ou Code postal <span class="csm-field-hint">(modifiable)</span></label>
              <input type="text" id="postalCodeCallback" name="postalCode" autocomplete="postal-code" placeholder="Ex. 75001 ou 75" value="${attr(this.state.postalCode)}" />
            </div>
          </div>
          ${this.renderProfessionField('professionCallback')}
          ${this.renderCoordsFields(true, { phoneRequired: true })}
          ${this.config?.fields?.newsletter_optin ? this.renderDynamicField('newsletter_optin', this.config.fields.newsletter_optin) : ''}
          ${this.renderConsentField()}
        </div>
      </section>`;
  }

  renderCoordsFields(required = true, options = {}) {
    const star = required ? '<span aria-hidden="true">*</span>' : '';
    const phoneRequired = Boolean(options.phoneRequired);
    const phoneStar = phoneRequired ? '<span aria-hidden="true">*</span>' : '';
    return `
      <div class="csm-field-row">
        <div class="csm-field">
          <label for="prenom">Prénom ${star}</label>
          <input type="text" id="prenom" name="prenom" autocomplete="given-name" value="${attr(this.state.prenom)}" ${required ? 'required' : ''} />
        </div>
        <div class="csm-field">
          <label for="nom">Nom ${star}</label>
          <input type="text" id="nom" name="nom" autocomplete="family-name" value="${attr(this.state.nom)}" ${required ? 'required' : ''} />
        </div>
      </div>
      <div class="csm-field-row">
        <div class="csm-field">
          <label for="telephone">Téléphone ${phoneStar}</label>
          <input type="tel" id="telephone" name="telephone" autocomplete="tel" value="${attr(this.state.telephone)}" ${phoneRequired ? 'required' : ''} />
        </div>
        <div class="csm-field">
          <label for="email">E-mail ${star}</label>
          <input type="email" id="email" name="email" autocomplete="email" value="${attr(this.state.email)}" ${required ? 'required' : ''} />
        </div>
      </div>`;
  }

  renderDynamicField(fieldId, fieldDef) {
    const val = this.state[fieldId] ?? fieldDef.default ?? '';
    const star = fieldDef.required ? '<span aria-hidden="true">*</span>' : '';
    const help = fieldDef.help ? `<p class="csm-field__help">${fieldDef.help}</p>` : '';
    const placeholder = fieldDef.placeholder ? `placeholder="${attr(fieldDef.placeholder)}"` : '';
    const colClass = `csm-col--${fieldDef.col || 'full'}`;

    // Condition d'affichage (ex: is_client=true)
    let isHidden = false;
    if (fieldDef.condition) {
      const condVal = this.state[fieldDef.condition.field];
      if (condVal !== fieldDef.condition.value) {
        isHidden = true;
      }
    }
    const hiddenAttr = isHidden ? 'hidden' : '';

    switch (fieldDef.type) {
      case 'toggle': {
        const checked = Boolean(this.state[fieldId] ?? fieldDef.default);
        const isNewsletter = fieldId === 'newsletter_optin';
        const displayLabel = isNewsletter
          ? (fieldDef.label || 'Recevoir les communications CSM Ingrédients')
          : fieldDef.label;
        return `
          <div class="csm-field ${colClass} ${isNewsletter ? 'csm-field--newsletter' : ''}" data-field="${fieldId}" ${hiddenAttr}>
            <label class="csm-toggle-card ${isNewsletter ? 'csm-toggle-card--newsletter' : ''} ${checked ? 'is-checked' : ''}">
              <div class="csm-toggle-card__main">
                ${isNewsletter ? `
                  <span class="csm-toggle-card__icon" aria-hidden="true">
                    ${icon('mail')}
                  </span>` : ''}
                <div class="csm-toggle-card__content">
                  <span class="csm-toggle-label">${escapeHtml(displayLabel)}</span>
                  ${fieldDef.help ? `
                    <span class="csm-toggle-help">
                      <span class="csm-toggle-help__text">${escapeHtml(fieldDef.help)}</span>
                      ${isNewsletter ? `<span class="csm-toggle-help__badge">${icon('check')} Sans engagement</span>` : ''}
                    </span>` : ''}
                </div>
              </div>
              <span class="csm-toggle-switch">
                <input type="checkbox" name="${fieldId}" data-action="toggle-switch" data-field="${fieldId}" ${checked ? 'checked' : ''} />
                <span class="csm-toggle-slider"></span>
              </span>
            </label>
          </div>`;
      }

      case 'urgency': {
        const selectedUrgency = this.state[fieldId] || fieldDef.default || 'normal';
        const urgencyOpts = fieldDef.options || [
          { id: 'normal', label: 'Normal (48h)', color: 'neutral' },
          { id: 'urgent', label: 'Urgent (24h)', color: 'warning' },
          { id: 'critical', label: 'Bloquant', color: 'danger' }
        ];
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label>${fieldDef.label} ${star}</label>
            <div class="csm-urgency-group" role="radiogroup">
              ${urgencyOpts.map((opt) => {
                const isSel = selectedUrgency === opt.id;
                const colKind = opt.color || 'neutral';
                return `
                  <button type="button" class="csm-urgency-pill csm-urgency-pill--${colKind} ${isSel ? 'is-selected' : ''}" data-action="select-urgency" data-field="${fieldId}" data-value="${opt.id}">
                    ${isSel ? icon('check') : ''} ${opt.label}
                  </button>`;
              }).join('')}
            </div>
            ${help}
          </div>`;
      }

      case 'slots': {
        const selectedSlot = this.state[fieldId] || '';
        const slotsOpts = fieldDef.options || [
          { id: 'morning', label: 'Matin (8h - 12h)' },
          { id: 'noon', label: 'Midi (12h - 14h)' },
          { id: 'afternoon', label: 'Après-midi (14h - 18h)' },
          { id: 'indifferent', label: 'Indifférent' }
        ];
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label>${fieldDef.label} ${star}</label>
            <div class="csm-slots-group" role="radiogroup">
              ${slotsOpts.map((opt) => {
                const optId = typeof opt === 'object' ? opt.id : opt;
                const optLbl = typeof opt === 'object' ? opt.label : opt;
                const isSel = selectedSlot === optId;
                return `
                  <button type="button" class="csm-slot-pill ${isSel ? 'is-selected' : ''}" data-action="select-slot" data-field="${fieldId}" data-value="${optId}">
                    ${isSel ? icon('check') : icon('clock')} ${optLbl}
                  </button>`;
              }).join('')}
            </div>
            ${help}
          </div>`;
      }

      case 'tags': {
        const selectedTags = Array.isArray(this.state[fieldId]) ? this.state[fieldId] : (this.state[fieldId] ? [this.state[fieldId]] : []);
        const tagOpts = fieldDef.options || [];
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label>${fieldDef.label} ${star}</label>
            <div class="csm-tags-group">
              ${tagOpts.map((t) => {
                const tLbl = typeof t === 'object' ? t.label : t;
                const isSel = selectedTags.includes(tLbl);
                return `
                  <button type="button" class="csm-tag-pill ${isSel ? 'is-selected' : ''}" data-action="toggle-tag" data-field="${fieldId}" data-value="${tLbl}">
                    ${isSel ? icon('check') : '+'} ${tLbl}
                  </button>`;
              }).join('')}
            </div>
            ${help}
          </div>`;
      }

      case 'date':
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label for="f_${fieldId}">${fieldDef.label} ${star}</label>
            <input type="date" id="f_${fieldId}" name="${fieldId}" value="${attr(val)}" ${fieldDef.required ? 'required' : ''} />
            ${help}
          </div>`;

      case 'textarea':
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label for="f_${fieldId}">${fieldDef.label} ${star}</label>
            <textarea id="f_${fieldId}" name="${fieldId}" rows="${fieldDef.rows || 3}" ${fieldDef.required ? 'required' : ''} ${placeholder}>${attr(val)}</textarea>
            ${help}
          </div>`;

      case 'select': {
        const selectOpts = fieldDef.options || [];
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label for="f_${fieldId}">${fieldDef.label} ${star}</label>
            <select id="f_${fieldId}" name="${fieldId}" ${fieldDef.required ? 'required' : ''}>
              <option value="">Sélectionnez…</option>
              ${selectOpts.map((opt) => {
                const oVal = typeof opt === 'object' ? opt.id : opt;
                const oLbl = typeof opt === 'object' ? opt.label : opt;
                return `<option value="${attr(oVal)}" ${val === oVal ? 'selected' : ''}>${oLbl}</option>`;
              }).join('')}
            </select>
            ${help}
          </div>`;
      }

      case 'file':
        return `<div class="${colClass}">${this.renderAttachmentField()}</div>`;

      case 'csm_postal': {
        const detected = this.state.assignedRegion;
        const deptPart = detected && detected.dept ? ` (${detected.dept})` : '';
        const feedbackHtml = detected && detected.name
          ? `<div class="csm-postal-feedback" id="postal-feedback-badge"><span class="csm-postal-feedback__badge" style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 10px;background:#e8f6ec;color:#1e7538;border-radius:20px;font-size:0.85rem;font-weight:600;"><span style="color:#2e9a4c;">✓</span> Secteur ${escapeHtml(detected.name)}${deptPart}</span></div>`
          : `<div class="csm-postal-feedback" id="postal-feedback-badge"></div>`;
        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label for="postalCodeInfos">${fieldDef.label} ${star}</label>
            <input type="text" id="postalCodeInfos" name="postalCode" autocomplete="postal-code" inputmode="numeric" maxlength="5" value="${attr(this.state.postalCode)}" ${placeholder} ${fieldDef.required ? 'required' : ''} />
            ${feedbackHtml}
            ${help}
          </div>`;
      }

      default: {
        const inputType = ['email', 'tel', 'number'].includes(fieldDef.type) ? fieldDef.type : 'text';
        const autoTokens = {
          prenom: 'given-name',
          nom: 'family-name',
          telephone: 'tel',
          phone: 'tel',
          email: 'email',
          societe: 'organization',
          company: 'organization',
          postalCode: 'postal-code',
          csm_postal: 'postal-code',
        };
        const autoAttr = fieldDef.autocomplete 
          ? `autocomplete="${attr(fieldDef.autocomplete)}"` 
          : (autoTokens[fieldId] ? `autocomplete="${autoTokens[fieldId]}"` : '');

        return `
          <div class="csm-field ${colClass}" data-field="${fieldId}" ${hiddenAttr}>
            <label for="f_${fieldId}">${fieldDef.label} ${star}</label>
            <input type="${inputType}" id="f_${fieldId}" name="${fieldId}" value="${attr(val)}" ${placeholder} ${autoAttr} ${fieldDef.required ? 'required' : ''} />
            ${help}
          </div>`;
      }
    }
  }

  getIntentImage(intentId) {
    const map = {
      contact_commercial: 'assets/intent-commercial.webp',
      conseil_produit: 'assets/intent-produit.webp',
      proposition: 'assets/intent-partenariat.webp',
      candidature: 'assets/intent-recrutement.webp',
      autre: 'assets/intent-autre.webp',
    };
    return map[intentId] || 'assets/contact-banner.png';
  }

  renderStepContent() {
    const stepId = this.getCurrentStepId();

    switch (stepId) {
      case 'intent':
        return `
          <fieldset class="csm-contact-form__section">
            <legend class="visually-hidden">Motif de votre demande</legend>
            <div class="csm-intent-grid csm-intent-grid--visual" role="radiogroup" aria-label="Sujet de votre demande">
              ${this.getIntents().map(
                (item) => `
                <label class="csm-intent-card csm-intent-card--visual ${this.state.intent === item.id ? 'is-selected' : ''}">
                  <input type="radio" name="intent" value="${item.id}" ${this.state.intent === item.id ? 'checked' : ''} />
                  <div class="csm-intent-card__media">
                    <img src="${this.getIntentImage(item.id)}" alt="${attr(item.label)}" class="csm-intent-card__img" loading="lazy" />
                    <span class="csm-intent-card__media-badge" aria-hidden="true">${icon(item.icon)}</span>
                    <span class="csm-intent-card__check" aria-hidden="true">${icon('check')}</span>
                  </div>
                  <div class="csm-intent-card__body">
                    <p class="csm-intent-card__label">${attr(item.label)}</p>
                    <p class="csm-intent-card__desc">${attr(item.description)}</p>
                  </div>
                </label>`
              ).join('')}
            </div>
          </fieldset>`;

      case 'infos': {
        const cfg = this.getIntentConfig();
        const configuredFields = cfg?.fields || cfg?.infosFields || [];
        const hasDynamicEngine = Boolean(this.config?.fields);
        const profileBanner = this.renderSavedProfileBanner();

        if (hasDynamicEngine && configuredFields.length > 0) {
          return `
            <div class="csm-step-stack">
              ${profileBanner}
              <div class="csm-fields-grid">
                ${configuredFields
                  .map((fieldId) => {
                    const fieldDef = this.config.fields[fieldId];
                    if (!fieldDef) return '';
                    return this.renderDynamicField(fieldId, fieldDef);
                  })
                  .join('')}
              </div>
            </div>`;
        }

        return `
          <div class="csm-step-stack">
            ${profileBanner}
            ${this.stepHasField('message') ? `
            <div class="csm-field">
              <label for="message">Votre message <span aria-hidden="true">*</span></label>
              <textarea id="message" name="message" rows="3" required placeholder="${this.getIntentConfig()?.messagePlaceholder || 'Décrivez votre demande…'}">${attr(this.state.message)}</textarea>
            </div>` : ''}
            ${this.stepHasField('product') ? `
            <div class="csm-field">
              <label for="productInterest">Produit ou recette</label>
              <input type="text" id="productInterest" name="productInterest" value="${attr(this.state.productInterest)}" placeholder="Ex. nappage, crème pâtissière…" />
            </div>` : ''}
            ${this.stepHasField('commande') ? this.renderCommandeFields() : ''}
            ${this.stepHasField('coords') ? this.renderCoordsFields(true) : ''}
            ${this.stepHasField('societe') ? this.renderSocieteField() : ''}
            ${this.stepHasField('postal') ? `
            <div class="csm-field csm-field--inline">
              <label for="postalCodeInfos">Code postal <span aria-hidden="true">*</span></label>
              <input type="text" id="postalCodeInfos" name="postalCode" inputmode="numeric" maxlength="5" value="${attr(this.state.postalCode)}" placeholder="Ex. 75001" required />
            </div>` : ''}
            ${this.stepHasField('profession') ? this.renderProfessionField() : ''}
            ${this.renderAttachmentField()}
          </div>`;
      }

      case 'zone':
        return `
          <section class="csm-map-section csm-map-section--view-${this.state.panelView}">
            <div class="csm-map-stage">
              <div class="csm-map-layer csm-map-layer--terrain" aria-hidden="${this.state.panelView !== 'terrain'}">
                <div class="csm-terrain-main">
                  <div class="csm-map-layout">
                    <div class="csm-map-frame">
                      <div class="csm-map-legend" aria-hidden="true">
                        <span class="csm-map-legend__item"><span class="csm-map-legend__dot csm-map-legend__dot--terrain"></span> Commercial</span>
                        <span class="csm-map-legend__item"><span class="csm-map-legend__dot csm-map-legend__dot--technico"></span> Technico-commercial</span>
                        <span class="csm-map-legend__item"><span class="csm-map-legend__dot csm-map-legend__dot--responsable"></span> Responsable régional</span>
                      </div>
                      <div id="map-container" class="csm-map-container" aria-label="Carte interactive des commerciaux terrain"></div>
                    </div>
                    <div id="contact-panel" class="csm-contact-panel">
                      <div class="csm-contact-panel__switcher-header">
                        <p class="csm-switcher-note">Vous êtes un site industriel ou grand compte ?</p>
                        ${this.renderPanelSwitcher()}
                      </div>
                      <div class="csm-zone-search-header">
                        <label for="postalCode" class="csm-zone-search-label">
                          <span class="csm-zone-search-title">${icon('mapPin')} Votre code postal</span>
                          <span class="csm-optional">(ou cliquez sur la carte)</span>
                        </label>
                        <div class="csm-zone-search-input-wrap">
                          <input type="text" id="postalCode" name="postalCode" inputmode="numeric" maxlength="5"
                            value="${attr(this.state.postalCode)}" placeholder="Ex. 67800, 75001…" class="csm-zone-search-input" />
                        </div>
                      </div>
                      <div id="terrain-contact-panel-body">${this.renderTerrainPanelBody()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="csm-map-layer csm-map-layer--industrie" aria-hidden="${this.state.panelView !== 'industrie'}">
                ${this.renderIndustryPanelContent()}
              </div>
            </div>
          </section>`;

      case 'confirm':
        return `
          ${this.renderConfirmRecap()}
          ${this.renderConsentField()}`;

      default:
        return '';
    }
  }

  renderProgress() {
    const steps = this.getStepIds();
    if (steps.length <= 1) return '';

    const currentStepId = this.getCurrentStepId();
    const saved = this.loadSavedProfile();
    const isInfoStep = currentStepId === 'infos' || (this.isCommercialIntent() && currentStepId === 'confirm');
    const nameOrCompany = saved ? (saved.societe || `${saved.prenom || ''} ${saved.nom || ''}`.trim()) : '';

    const savedBadgeHtml = (saved && isInfoStep)
      ? `<span class="csm-saved-badge" role="status" title="Coordonnées mémorisées chargées">
           <span class="csm-saved-badge__check" aria-hidden="true">✓</span>
           <span class="csm-saved-badge__text">Infos mémorisées ${nameOrCompany ? `(${escapeHtml(nameOrCompany)})` : ''}</span>
           <button type="button" class="csm-saved-badge__clear" data-action="clear-profile" title="Effacer ces coordonnées" aria-label="Effacer les coordonnées">✕</button>
         </span>`
      : '';

    const isLastStep = this.state.step === steps.length - 1;
    const captchaBadgeHtml = isLastStep ? this.renderCaptchaBadge() : '';

    return `
      <div class="csm-wizard__progress" role="navigation" aria-label="Progression du formulaire">
        ${steps
          .map((stepKey, index) => {
            const done = index < this.state.step;
            const active = index === this.state.step;
            const connector =
              index < steps.length - 1
                ? `<span class="csm-wizard__connector ${done ? 'is-done' : ''}"></span>`
                : '';
            const label = STEP_LABELS[stepKey] || `Étape ${index + 1}`;

            if (done) {
              return `<button type="button" class="csm-wizard__dot is-done" data-action="go-to-step" data-step="${index}" title="Retour à l'étape ${index + 1} (${label})" aria-label="Retour à l'étape ${index + 1} (${label})"></button>${connector}`;
            }
            if (active) {
              return `<span class="csm-wizard__dot is-active" aria-current="step" title="Étape actuelle : ${label}"></span>${connector}`;
            }
            return `<span class="csm-wizard__dot" title="Étape ${index + 1} : ${label}"></span>${connector}`;
          })
          .join('')}
      </div>
      <div class="csm-wizard__step-label-row">
        <span class="csm-wizard__step-label">Étape ${this.state.step + 1} / ${steps.length} · ${STEP_LABELS[currentStepId] || ''}</span>
        ${savedBadgeHtml}
        ${captchaBadgeHtml}
      </div>`;
  }

  render() {
    const stepId = this.getCurrentStepId();
    const isFirst = this.state.step === 0;
    const isLast = Boolean(this.state.intent) && this.state.step === this.getStepIds().length - 1;
    const showMap = stepId === 'zone';
    const useWideModal = showMap || stepId === 'intent';
    
    // Animer uniquement lors d'un vrai changement d'étape (ex: étape 1 -> étape 2)
    const isStepChange = this._lastRenderedStep !== undefined && this._lastRenderedStep !== this.state.step;
    const animClass = isStepChange
      ? (this.stepDirection === 'back' ? 'csm-wizard__step--back' : 'csm-wizard__step--forward')
      : '';
    this._lastRenderedStep = this.state.step;

    this.root.innerHTML = `
      <div class="csm-modal ${useWideModal ? 'csm-modal--wide' : ''}" role="region" aria-labelledby="csm-form-title">
        <form class="csm-contact-form csm-wizard" novalidate>
          ${this.renderHoneypot()}
          <header class="csm-contact-form__header">
            <div class="csm-contact-form__heading">
              <h1 id="csm-form-title" class="csm-form-main-title">Nous contacter</h1>
              <p class="csm-contact-form__intro">Vous avez besoin de plus d'informations ? Adressez-nous votre message ci-dessous ou contactez-nous sur notre numéro vert.</p>
              ${this.state.intent ? this.renderProgress() : ''}
            </div>
          </header>
          <div class="csm-wizard__body ${showMap ? 'csm-wizard__body--map' : ''}">
            <div class="csm-wizard__step ${animClass}">
              ${this.renderStepContent()}
            </div>
          </div>
          <p id="form-error" class="csm-form-error" role="alert" aria-live="assertive"></p>
          <footer class="csm-wizard__footer">
            <div class="csm-footer-quick-contact">
              <div class="csm-footer-item">
                <span class="csm-footer-label">Numéro vert :</span>
                <a href="tel:0800616816" class="csm-footer-link">0 800 616 816</a>
              </div>
              <span class="csm-footer-sep" aria-hidden="true">·</span>
              <div class="csm-footer-item">
                <span class="csm-footer-label">Email :</span>
                <a href="mailto:info.france@csmingredients.com" class="csm-footer-link">info.france@csmingredients.com</a>
              </div>
            </div>
            <div class="csm-footer-actions ${isLast ? 'csm-footer-actions--confirm' : ''}">
              ${isLast ? `
                <div class="csm-footer-consent-note">
                  En validant, vous acceptez la <a href="https://www.csmingredients.com/france/fr_fr/generals/politique-de-confidentialite" target="_blank" rel="noopener">politique de confidentialité</a>
                </div>` : ''}
              <div class="csm-footer-buttons">
                ${!isFirst ? `<button type="button" class="csm-btn csm-btn--secondary" data-action="back">${icon('chevronLeft')} Retour</button>` : ''}
                ${isLast
                  ? `<button type="submit" class="csm-btn csm-btn--primary">${this.getSubmitLabel()} ${icon(this.getSubmitIcon())}</button>`
                  : `<button type="button" class="csm-btn csm-btn--primary" data-action="next">${showMap ? 'Demander un rappel' : 'Continuer'} ${icon('chevronRight')}</button>`}
              </div>
            </div>
          </footer>
        </form>
      </div>`;

    this.bindEvents();

    if (showMap && this.map) {
      const mapEl = this.root.querySelector('#map-container');
      if (mapEl) {
        this.map.container = mapEl;
        this.map.init().then(() => {
          if (this.state.postalCode) this.updateZoneFromPostalCode();
        });
      }
    }
  }

  bindEvents() {
    const form = this.root.querySelector('.csm-contact-form');
    if (!form) return;

    form.querySelectorAll('input[name="intent"]').forEach((input) => {
      input.addEventListener('click', () => {
        this.selectIntent(input.value);
      });
    });

    form.querySelectorAll('input[name="contactMode"]').forEach((input) => {
      input.addEventListener('change', () => {
        this.state.contactMode = input.value;
        this.stepErrors = [];
        this.render();
      });
    });

    form.querySelectorAll('[data-action="panel-view"]').forEach((button) => {
      button.addEventListener('click', () => {
        this.setPanelView(button.dataset.view);
      });
    });

    // Gestion dynamique de tous les champs de saisie
    form.querySelectorAll('input:not([type="radio"]):not([type="file"]):not([data-action="toggle-switch"]), select, textarea').forEach((el) => {
      const name = el.name;
      if (!name || name === 'website') return;
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
        this.state[name] = el.type === 'checkbox' ? el.checked : el.value;
        if (name === 'profession') {
          this.syncProfessionAutreField();
          if (this.state.profession !== 'Autre') this.clearErrorFields('professionAutre');
        }
        this.clearControlError(el);
        if (name === 'postalCode') {
          this.updateZoneFromPostalCode();
        }
        if (['prenom', 'nom', 'telephone', 'email', 'societe', 'postalCode', 'profession'].includes(name)) {
          this.saveClientProfile();
        }
      });
    });

    // Effacement des coordonnées mémorisées
    form.querySelectorAll('[data-action="clear-profile"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearSavedProfile();
      });
    });

    // Composant interactif : Slots de rappel (mise à jour fluide en place)
    form.querySelectorAll('[data-action="select-slot"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = btn.dataset.field;
        const val = btn.dataset.value;
        const isCurrentlySelected = this.state[field] === val;
        this.state[field] = isCurrentlySelected ? '' : val;

        const group = btn.closest('.csm-slots-group');
        if (group) {
          group.querySelectorAll('[data-action="select-slot"]').forEach((b) => {
            const isSel = b.dataset.value === this.state[field];
            b.classList.toggle('is-selected', isSel);
            const existingIcon = b.querySelector('svg');
            if (existingIcon) {
              existingIcon.outerHTML = isSel ? icon('check') : icon('clock');
            }
          });
        }
      });
    });

    // Composant interactif : Niveau d'urgence (mise à jour fluide en place)
    form.querySelectorAll('[data-action="select-urgency"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = btn.dataset.field;
        const val = btn.dataset.value;
        this.state[field] = val;

        const group = btn.closest('.csm-urgency-group');
        if (group) {
          group.querySelectorAll('[data-action="select-urgency"]').forEach((b) => {
            const isSel = b.dataset.value === val;
            b.classList.toggle('is-selected', isSel);
            const checkSvg = b.querySelector('svg');
            if (isSel && !checkSvg) {
              b.insertAdjacentHTML('afterbegin', `${icon('check')} `);
            } else if (!isSel && checkSvg) {
              checkSvg.remove();
            }
          });
        }
      });
    });

    // Composant interactif : Tags / Famille de produits (mise à jour fluide en place)
    form.querySelectorAll('[data-action="toggle-tag"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = btn.dataset.field;
        const val = btn.dataset.value;
        let list = Array.isArray(this.state[field]) ? [...this.state[field]] : [];
        if (list.includes(val)) {
          list = list.filter((item) => item !== val);
        } else {
          list.push(val);
        }
        this.state[field] = list;

        const isSel = list.includes(val);
        btn.classList.toggle('is-selected', isSel);
        btn.innerHTML = `${isSel ? icon('check') : '+'} ${escapeHtml(val)}`;
      });
    });

    // Composant interactif : Toggle switch Oui/Non (mise à jour ciblée sans flash)
    form.querySelectorAll('[data-action="toggle-switch"]').forEach((chk) => {
      chk.addEventListener('change', () => {
        const field = chk.dataset.field;
        this.state[field] = chk.checked;
        const card = chk.closest('.csm-toggle-card');
        if (card) {
          card.classList.toggle('is-checked', chk.checked);
        }
        if (field === 'is_client') {
          this.saveClientProfile();
        }
        form.querySelectorAll('[data-field]').forEach((fEl) => {
          const fid = fEl.dataset.field;
          const fDef = this.config?.fields?.[fid];
          if (fDef?.condition) {
            const matches = this.state[fDef.condition.field] === fDef.condition.value;
            fEl.hidden = !matches;
          }
        });
      });
    });

    form.querySelectorAll('[data-action="go-to-step"]').forEach((button) => {
      button.addEventListener('click', () => {
        const targetStep = parseInt(button.dataset.step, 10);
        if (!isNaN(targetStep) && targetStep < this.state.step) {
          this.stepDirection = 'back';
          this.state.step = targetStep;
          this.stepErrors = [];
          this.render();
          this.scrollToFormTop();
        }
      });
    });

    form.querySelectorAll('[data-action="back"]').forEach((button) => {
      button.addEventListener('click', () => {
        if (this.state.step > 0) {
          this.stepDirection = 'back';
          this.state.step -= 1;
          this.stepErrors = [];
          this.render();
          this.scrollToFormTop();
        }
      });
    });

    // Délégation d'événement pour le clic "Être rappelé" sur n'importe quelle carte
    form.addEventListener('click', (e) => {
      const callbackBtn = e.target.closest('[data-action="request-callback"]');
      if (callbackBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.selectCommercialForCallback(callbackBtn.dataset.contactId);
      }
    });

    // Bouton modifier le commercial / secteur depuis la confirmation de rappel
    form.querySelectorAll('[data-action="edit-commercial"]').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.stepErrors = [];
        this.stepDirection = 'back';
        const steps = this.getStepIds();
        const zoneIdx = steps.indexOf('zone');
        this.state.step = zoneIdx >= 0 ? zoneIdx : Math.max(0, this.state.step - 1);
        this.render();
        this.scrollToFormTop();
      });
    });

    // Choix du commercial pour le rappel à l'étape 3
    form.querySelectorAll('input[name="callbackCommercialChoice"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        this.state.callbackCommercialChoice = radio.value;
        const available = this.getAvailableCallbackContacts();
        if (radio.value === 'any') {
          this.state.assignedContact = null;
        } else {
          this.state.assignedContact = available.find((c) => String(c.id) === String(radio.value)) || null;
        }
        form.querySelectorAll('.csm-callback-choice').forEach((lbl) => {
          const r = lbl.querySelector('input[type="radio"]');
          lbl.classList.toggle('is-selected', Boolean(r?.checked));
        });
      });
    });

    form.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      if (this.isCommercialIntent() && this.getCurrentStepId() === 'zone') {
        this.state.contactMode = 'callback';
        const contacts = this.getAvailableCallbackContacts();
        if (contacts.length > 1) {
          this.state.callbackCommercialChoice = 'any';
          this.state.assignedContact = null;
        } else if (contacts.length === 1) {
          this.state.callbackCommercialChoice = contacts[0].id;
          this.state.assignedContact = contacts[0];
        }
      }
      if (this.presentStepErrors(form)) return;
      this.stepErrors = [];
      this.stepDirection = 'forward';
      this.state.step += 1;
      this.render();
      this.scrollToFormTop();
    });

    form.querySelector('[name="consent"]')?.addEventListener('change', (e) => {
      this.state.consent = e.target.checked;
      this.clearControlError(e.target);
    });

    form.querySelector('#attachments')?.addEventListener('change', (e) => {
      const error = this.addAttachmentFiles(Array.from(e.target.files || []));
      this.stepErrors = error ? [{ field: 'attachments', message: error }] : [];
      this.render();
    });

    form.querySelectorAll('[data-action="remove-attachment"]').forEach((button) => {
      button.addEventListener('click', () => {
        this.removeAttachment(button.dataset.id);
        const attachmentError = this.validateAttachments();
        this.stepErrors = attachmentError
          ? [{ field: 'attachments', message: attachmentError }]
          : this.stepErrors.filter((err) => err.field !== 'attachments');
        this.render();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._submitting) return;
      if (this.presentStepErrors(form)) return;
      this.stepErrors = [];
      this.handleSubmit();
    });

    this.syncErrorUI(form, { focus: false });
  }

  submitToMailchimp() {
    return new Promise((resolve) => {
      const callbackName = 'mc_cb_' + Math.random().toString(36).substring(2, 9);
      const script = document.createElement('script');

      const isCallback = this.state.contactMode === 'callback';
      const commercialName = this.state.assignedContact
        ? `${this.state.assignedContact.prenom} ${this.state.assignedContact.nom}`
        : (this.state.callbackCommercialChoice === 'any' ? 'N\'importe quel commercial de ce secteur' : 'Non précisé');

      const secteurLibelle = this.state.assignedRegion?.name || (this.state.assignedRegion?.id ? `Secteur ${this.state.assignedRegion.id}` : '');
      const dptValue = this.state.postalCode ? (this.state.postalCode.length === 5 ? this.state.postalCode.substring(0, 2) : this.state.postalCode) : (this.state.assignedRegion?.id || '');

      const params = new URLSearchParams({
        u: '207d37df0e476cbe5d215d510',
        id: '99dbab4e30',
        b_207d37df0e476cbe5d215d510_99dbab4e30: '',
        EMAIL: this.state.email || '',
        MERGE0: this.state.email || '',
        FNAME: this.state.prenom || '',
        MERGE1: this.state.prenom || '',
        LNAME: this.state.nom || '',
        MERGE2: this.state.nom || '',
        PHONE: this.state.telephone || '',
        MERGE4: this.state.telephone || '',
        MMERGE13: this.state.societe || '',
        MERGE13: this.state.societe || '',
        MMERGE14: dptValue,
        MERGE14: dptValue,
        MMERGE17: this.getProfessionLabel() || '',
        MERGE17: this.getProfessionLabel() || '',
        MMERGE19: secteurLibelle,
        MERGE19: secteurLibelle,
        c: callbackName,
      });

      const timeout = setTimeout(() => {
        cleanup();
        resolve({ result: 'timeout' });
      }, 6000);

      function cleanup() {
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.remove();
      }

      window[callbackName] = (response) => {
        cleanup();
        console.info('[Mailchimp direct sync]', response);
        resolve(response);
      };

      script.onerror = () => {
        cleanup();
        resolve({ result: 'network_error' });
      };

      script.src = `https://csmingredients.us10.list-manage.com/subscribe/post-json?${params.toString()}`;
      document.body.appendChild(script);
    });
  }

  async handleSubmit() {
    const form = this.root.querySelector('.csm-contact-form');
    const isDirectCommercial = this.isCommercialIntent() && this.state.contactMode === 'direct';

    if (form?.querySelector('[name="website"]')?.value) {
      this.showSuccessScreen(isDirectCommercial);
      return;
    }

    if (!isDirectCommercial && this.options.submitUrl && this.isRateLimited()) {
      this.presentSubmitError('Merci de patienter quelques secondes avant un nouvel envoi.');
      return;
    }

    this._submitting = true;
    const submitBtn = form?.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      let recaptchaToken = '';
      if (!isDirectCommercial && this.options.recaptchaSiteKey) {
        recaptchaToken = await this.getRecaptchaToken();
        if (!recaptchaToken) {
          this.presentSubmitError('La vérification anti-spam a échoué. Réessayez.');
          return;
        }
      }

      // 1. Synchronisation automatique directe avec Mailchimp (si opt-in coché)
      if (!isDirectCommercial && this.state.email && this.state.newsletter_optin) {
        try {
          const mcRes = await this.submitToMailchimp();
          console.info('[CSM Contact] Synchronisation Mailchimp :', mcRes);
        } catch (mcErr) {
          console.warn('[CSM Contact] Avertissement Mailchimp :', mcErr);
        }
      }

      // 2. Envoi vers l'URL configurée (Web3Forms ou endpoint entreprise) si présente
      const payload = isDirectCommercial ? null : this.buildFormData(recaptchaToken);

      if (payload && this.options.submitUrl) {
        const isExternal = /^https?:\/\//i.test(this.options.submitUrl) && !this.options.submitUrl.startsWith(window.location.origin);
        const response = await fetch(this.options.submitUrl, {
          method: 'POST',
          body: payload,
          headers: { 'Accept': 'application/json' },
          ...(isExternal ? {} : { credentials: 'same-origin' }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || (result && result.success === false)) {
          throw new Error(result?.message || `HTTP ${response.status}`);
        }
      } else if (payload) {
        console.info('Formulaire CSM synchronisé directement avec Mailchimp !', payload);
      }

      if (!isDirectCommercial && this.options.submitUrl) this.markSubmitTime();
      this.saveClientProfile();
      this.showSuccessScreen(isDirectCommercial);
    } catch (err) {
      console.error('[CSM Contact]', err);
      this.presentSubmitError(err?.message && !err.message.startsWith('HTTP') ? err.message : 'L\'envoi a échoué. Réessayez dans un instant.');
    } finally {
      this._submitting = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  showSuccessScreen(isDirectCommercial) {
    const general = this.config?.general || {};
    const successTitle = isDirectCommercial
      ? 'Coordonnées directes de votre commercial'
      : (general.successTitle || 'Merci, votre demande a bien été transmise');
    const successLead = isDirectCommercial
      ? 'Vous pouvez contacter votre commercial directement par téléphone ou par e-mail.'
      : (general.successLead || 'Notre équipe CSM Ingredients France a bien pris en compte votre message.');

    const contactName = this.state.assignedContact
      ? `${this.state.assignedContact.prenom} ${this.state.assignedContact.nom}`
      : (this.state.callbackCommercialChoice === 'any' ? 'un commercial de votre secteur' : '');

    const responseLead = general.responseTimeLead || '24 à 48h ouvrées';
    const emergencyEmail = general.emergencyEmail || 'info.france@csmingredients.com';
    const emergencyPhone = general.emergencyPhone || '0 800 616 816';

    this.root.innerHTML = `
      <div class="csm-modal csm-modal--success" role="status">
        <div class="csm-success">
          <span class="csm-success__icon">${icon('check')}</span>
          <h2>${successTitle}</h2>
          <p class="csm-success__lead">${successLead}</p>

          <div class="csm-success__details">
            <div class="csm-success__detail-item">
              <span class="csm-success__detail-icon">${icon('clock')}</span>
              <div>
                <strong>Délai indicatif de réponse</strong>
                <p>Un conseiller commercial de notre équipe ${this.state.assignedRegion?.name ? `(${escapeHtml(this.state.assignedRegion.name)})` : ''} vous recontactera sous <strong>${responseLead}</strong></p>
              </div>
            </div>

            <div class="csm-success__detail-item csm-success__detail-item--urgent">
              <span class="csm-success__detail-icon">${icon('alertTriangle')}</span>
              <div>
                <strong>Une urgence opérationnelle ou commande en cours ?</strong>
                <p>N'hésitez pas à joindre directement notre service par e-mail à <a href="mailto:${emergencyEmail}">${emergencyEmail}</a> ou par téléphone au <a href="tel:${emergencyPhone.replace(/\s+/g, '')}">${emergencyPhone}</a>.</p>
              </div>
            </div>
          </div>

          <div class="csm-success__actions">
            <button type="button" class="csm-btn csm-btn--secondary" id="reset-form">${icon('refresh')} Envoyer une autre demande</button>
          </div>
        </div>
      </div>`;

    this.root.querySelector('#reset-form')?.addEventListener('click', () => {
      this.state = this.getInitialState();
      this._attachmentSeq = 0;
      this.stepErrors = [];
      this.stepDirection = 'forward';
      this.map?.resetHighlight();
      this.render();
    });
  }
}
