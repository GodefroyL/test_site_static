// Charge dynamiquement le fragment header depuis /src/components/header.html
(function() {
	async function tryFetch(url) {
		try {
			const resp = await fetch(url, { cache: 'no-store' });
			if (resp.ok) return resp;
			return null;
		} catch (e) {
			return null;
		}
	}

	async function loadHeader() {
		try {
			const candidates = [
				'components/header.html', // relative
				'./components/header.html',
				'../components/header.html',
				'/components/header.html', // root-relative (when server root is src)
				'/src/components/header.html' // if server root is project root
			];

			let resp = null;
			for (const p of candidates) {
				const url = new URL(p, location.href);
				console.log('Tentative de chargement du header depuis:', url.href);
				resp = await tryFetch(url.href);
				if (resp) {
					console.log('Header chargé depuis', url.href);
					break;
				} else {
					console.warn('Échec pour', url.href);
				}
			}

			if (!resp) {
				console.warn('Impossible de charger le header: aucun des chemins candidats ne répond — insertion d\'un header de secours');
				// fallback: injecter un header minimal construit dynamiquement pour fonctionner sans serveur
				const container = document.getElementById('header');
				if (!container) return;
				container.innerHTML = '';
				const headerEl = document.createElement('header');
				const nav = document.createElement('nav');
				const ul = document.createElement('ul');

				// Déterminer si nous sommes dans le dossier /articles/ pour calculer les href relatifs
				const inArticles = location.pathname.includes('/articles/') || location.pathname.match(/\/articles\//);
				const links = [
					{ text: 'Accueil', href: inArticles ? '../index.html' : 'index.html' },
					{ text: 'Article 1', href: inArticles ? 'article-1.html' : 'articles/article-1.html' },
					{ text: 'Article 2', href: inArticles ? 'article-2.html' : 'articles/article-2.html' }
				];

				links.forEach(l => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.textContent = l.text;
					a.setAttribute('href', l.href);
					li.appendChild(a);
					ul.appendChild(li);
				});

				nav.appendChild(ul);
				headerEl.appendChild(nav);
				container.appendChild(headerEl);

				// marquer le lien actif
				try {
					const anchors = container.querySelectorAll('a');
					anchors.forEach(a => {
						const resolved = new URL(a.getAttribute('href'), location.href);
						if (resolved.pathname === location.pathname) a.classList.add('active');
					});
				} catch (e) {
					// ignore
				}
				return;
			}

			const html = await resp.text();
			const container = document.getElementById('header');
			if (container) container.innerHTML = html;

			// Convertir data-target en href approprié pour fonctionner sur GitHub Pages et local
			try {
				const anchors = container.querySelectorAll('a[data-target]');
				const inArticles = location.pathname.includes('/articles/') || location.pathname.match(/\/articles\//);
				anchors.forEach(a => {
					const target = a.getAttribute('data-target');
					// Si on est dans un fichier sous /src/articles/ (chemins relatifs nécessaires)
					if (inArticles) {
						// depuis une page articles/*.html, les href vers articles doivent être relatives
						if (target.startsWith('articles/')) {
							a.setAttribute('href', target.replace('articles/', '')); // article-1.html
						} else {
							a.setAttribute('href', '../' + target);
						}
					} else {
						// depuis la racine (index.html), utiliser chemins relatifs au serveur
						a.setAttribute('href', target);
					}
				});

				// marquer le lien actif
				const allAnchors = container.querySelectorAll('a[href]');
				allAnchors.forEach(a => {
					try {
						const resolved = new URL(a.getAttribute('href'), location.href);
						if (resolved.pathname === location.pathname) a.classList.add('active');
					} catch (e) { /* ignore */ }
				});
			} catch (e) {
				// ignore
			}
		} catch (err) {
			console.error('Erreur lors du chargement du header:', err);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadHeader);
	} else {
		loadHeader();
	}
})();