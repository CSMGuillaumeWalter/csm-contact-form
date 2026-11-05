import { REGION_LABELS } from './departements.js';

const COLORS = {
  regionDefault: '#a6bed8',
  regionHover: '#7b9dc0',
  regionActive: '#007cbd',
  regionActiveHover: '#005a8f',
  regionMuted: '#c8d7e6',
  markerTerrain: '#2e9a4c',
  markerTechnico: '#e8b422',
  markerChef: '#003c61',
  markerActiveTerrain: '#1e7538',
  markerActiveTechnico: '#c48a08',
  markerActiveChef: '#002238',
  markerStroke: '#ffffff',
};

export class FranceMap {
  /**
   * @param {HTMLElement} container
   * @param {object} data - contenu de commerciaux.json
   * @param {{ onRegionSelect?: Function, onCommercialSelect?: Function }} callbacks
   */
  constructor(container, data, callbacks = {}) {
    this.container = container;
    this.data = data;
    this.callbacks = callbacks;
    this.svg = null;
    this.activeRegion = null;
    this.activeCommercial = null;
  }

  async init(svgUrl = 'assets/fr.svg') {
    if (this.svg && this.container.contains(this.svg)) {
      this.renderCommercialMarkers();
      return;
    }

    const response = await fetch(svgUrl);
    const svgText = await response.text();
    this.container.innerHTML = svgText;
    this.svg = this.container.querySelector('svg');
    if (!this.svg) throw new Error('SVG introuvable');

    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', 'Carte de France interactive des commerciaux CSM Ingredients');
    this.enhanceSvg();
    this.renderCommercialMarkers();
    this.bindRegionEvents();
  }

  enhanceSvg() {
    this.svg.classList.add('csm-france-map');
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .csm-france-map #features {
        filter: drop-shadow(0 3px 8px rgba(15, 23, 42, 0.12));
      }
      .csm-france-map .region {
        cursor: pointer;
        outline: none;
        fill: ${COLORS.regionDefault};
        stroke: #ffffff;
        stroke-width: 1.5px;
        stroke-linejoin: round;
        stroke-linecap: round;
        transition: fill 0.3s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.25s ease, opacity 0.3s ease;
      }
      .csm-france-map .region:hover {
        fill: ${COLORS.regionHover};
        stroke: #ffffff;
        stroke-width: 2px;
      }
      .csm-france-map .region.is-active {
        fill: ${COLORS.regionActive};
        stroke: #ffffff;
        stroke-width: 2.2px;
      }
      .csm-france-map .region.is-active:hover {
        fill: ${COLORS.regionActiveHover};
      }
      .csm-france-map .region.is-muted {
        fill: ${COLORS.regionMuted};
        opacity: 0.92;
      }
      .csm-france-map .region:focus,
      .csm-france-map .region:focus-visible { outline: none; }
      .csm-france-map .commercial-marker {
        cursor: pointer;
        outline: none;
        opacity: 1;
        transform-box: fill-box;
        transform-origin: center;
        transition: opacity 0.45s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .csm-france-map .commercial-marker.is-dimmed {
        opacity: 0.22;
        transform: scale(0.82);
      }
      .csm-france-map .commercial-marker.is-active {
        transform: scale(1.18);
      }
      .csm-france-map .commercial-marker:focus,
      .csm-france-map .commercial-marker:focus-visible { outline: none; }
      .csm-france-map .commercial-marker circle {
        transition: fill 0.4s ease, r 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .csm-france-map .commercial-marker--terrain:hover circle { fill: ${COLORS.markerActiveTerrain}; r: 11; }
      .csm-france-map .commercial-marker--technico:hover circle { fill: ${COLORS.markerActiveTechnico}; r: 11; }
      .csm-france-map .commercial-marker--responsable:hover circle,
      .csm-france-map .commercial-marker--chef:hover circle { fill: ${COLORS.markerActiveChef}; r: 12; }
      .csm-france-map .commercial-marker.is-active.commercial-marker--terrain circle { fill: ${COLORS.markerActiveTerrain}; r: 11; }
      .csm-france-map .commercial-marker.is-active.commercial-marker--technico circle { fill: ${COLORS.markerActiveTechnico}; r: 11; }
      .csm-france-map .commercial-marker.is-active.commercial-marker--responsable circle,
      .csm-france-map .commercial-marker.is-active.commercial-marker--chef circle { fill: ${COLORS.markerActiveChef}; r: 12; }
      .csm-france-map #label_points, .csm-france-map #points { display: none; }
    `;
    this.svg.insertBefore(style, this.svg.firstChild);

    this.svg.querySelectorAll('#features path').forEach((path) => {
      path.classList.add('region');
      const id = path.id;
      const name = this.data.regions[id]?.name || REGION_LABELS[id] || id;
      path.setAttribute('tabindex', '-1');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `Région ${name}`);
    });
  }

  getMapContacts() {
    const contacts = [];
    Object.entries(this.data.regions).forEach(([regionId, region]) => {
      const regularCommercials = (region.contacts || []).filter(
        (c) => c.showOnMap !== false && c.role === 'commercial'
      );
      if (regularCommercials.length > 0) {
        regularCommercials.forEach((contact) => {
          contacts.push({ ...contact, regionId, regionName: region.name });
        });
      } else {
        const chefs = (region.contacts || []).filter(
          (c) => c.showOnMap !== false && (c.role === 'chef_des_ventes' || c.role === 'chef_region' || (c.fonction || '').toLowerCase().includes('chef'))
        );
        chefs.forEach((contact) => {
          contacts.push({ ...contact, regionId, regionName: region.name });
        });
      }
    });
    return contacts;
  }

  renderCommercialMarkers() {
    let markersGroup = this.svg.querySelector('#commercial_markers');
    if (!markersGroup) {
      markersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      markersGroup.id = 'commercial_markers';
      this.svg.appendChild(markersGroup);
    }
    markersGroup.innerHTML = '';

    this.getMapContacts().forEach((contact) => {
      if (!contact.mapPosition) return;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const isResponsable = contact.role === 'chef_des_ventes' || contact.role === 'chef_region' || (contact.fonction || '').toLowerCase().includes('responsable') || (contact.fonction || '').toLowerCase().includes('chef');
      const isTechnico = contact.fonction === 'Technico-commercial';
      const markerType = isResponsable ? 'responsable' : (isTechnico ? 'technico' : 'terrain');
      g.classList.add('commercial-marker', `commercial-marker--${markerType}`);
      g.dataset.contactId = contact.id;
      g.dataset.regionId = contact.regionId;
      g.setAttribute('role', 'button');
      g.setAttribute('tabindex', '-1');
      g.setAttribute('aria-label', `${contact.prenom} ${contact.nom}, ${contact.fonction || 'Commercial'}, ${contact.regionName}`);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', contact.mapPosition.x);
      circle.setAttribute('cy', contact.mapPosition.y);
      circle.setAttribute('r', isResponsable ? '10' : '9');
      const fillColor = isResponsable ? COLORS.markerChef : (isTechnico ? COLORS.markerTechnico : COLORS.markerTerrain);
      circle.setAttribute('fill', fillColor);
      circle.setAttribute('stroke', COLORS.markerStroke);
      circle.setAttribute('stroke-width', isResponsable ? '3' : '2.5');

      g.appendChild(circle);

      const activate = (e) => {
        e.preventDefault();
        this.selectCommercial(contact.id, contact.regionId);
        g.blur();
      };
      g.addEventListener('mousedown', (e) => e.preventDefault());
      g.addEventListener('click', activate);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });

      markersGroup.appendChild(g);
    });
  }

  bindRegionEvents() {
    this.svg.querySelectorAll('#features path.region').forEach((path) => {
      const activate = (e) => {
        e.preventDefault();
        this.selectRegion(path.id);
        path.blur();
        this.svg.blur();
      };
      path.addEventListener('mousedown', (e) => e.preventDefault());
      path.addEventListener('click', activate);
      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  selectRegion(regionId, options = {}) {
    this.activeRegion = regionId;
    this.activeCommercial = options.contactId || null;

    this.svg.querySelectorAll('.region').forEach((el) => {
      el.classList.toggle('is-active', el.id === regionId);
      el.classList.toggle('is-muted', regionId && el.id !== regionId);
    });

    this.svg.querySelectorAll('.commercial-marker').forEach((el) => {
      const inRegion = el.dataset.regionId === regionId;
      el.classList.toggle('is-dimmed', Boolean(regionId) && !inRegion);
      el.classList.toggle('is-active', el.dataset.contactId === this.activeCommercial);
    });

    const region = this.data.regions[regionId];
    const regularCommercials = (region?.contacts || []).filter(
      (c) => c.showOnMap !== false && c.role === 'commercial'
    );
    const chefs = (region?.contacts || []).filter(
      (c) => c.showOnMap !== false && (c.role === 'chef_des_ventes' || c.role === 'chef_region' || (c.fonction || '').toLowerCase().includes('chef'))
    );
    const mapContacts = regularCommercials.length > 0 ? regularCommercials : chefs;
    const regionalManager = chefs[0] || null;

    if (!options.silent) {
      this.callbacks.onRegionSelect?.({
        regionId,
        regionName: region?.name || REGION_LABELS[regionId],
        contacts: region?.contacts || [],
        mapContacts,
        regionalManager,
      });
    }
  }

  selectCommercial(contactId, regionId) {
    this.selectRegion(regionId, { contactId });
    const region = this.data.regions[regionId];
    const contact = region?.contacts.find((c) => c.id === contactId);
    if (contact) this.callbacks.onCommercialSelect?.({ contact, regionId, regionName: region.name });
  }

  highlightFromPostalCode(regionId, contactId = null) {
    if (!regionId) {
      this.resetHighlight();
      return;
    }
    this.selectRegion(regionId, { contactId, silent: true });
  }

  resetHighlight() {
    this.activeRegion = null;
    this.activeCommercial = null;
    this.svg?.querySelectorAll('.region').forEach((el) => {
      el.classList.remove('is-active', 'is-muted');
    });
    this.svg?.querySelectorAll('.commercial-marker').forEach((el) => {
      el.classList.remove('is-active', 'is-dimmed');
    });
  }

  updateData(data) {
    this.data = data;
    this.renderCommercialMarkers();
    if (this.activeRegion) this.selectRegion(this.activeRegion);
  }
}
