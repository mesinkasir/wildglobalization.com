const siteUrl = process.env.URL || 'https://wildglobalization.com/';
const canonicalSiteUrl = siteUrl.replace(/\/$/, '');

const garyBedford = {
	name: 'Gary Bedford',
	url: 'https://www.garybedford.com/',
	sameAs: [
		'https://www.linkedin.com/in/garybedford/',
		'https://thewhitestonefoundation.org/people/',
		'https://www.garybedford.com/',
		'https://independent.academia.edu/GaryBedford',
		'https://explore.wildglobalization.com/'
	],
	alumniOf: [
		{
			'@type': 'CollegeOrUniversity',
			name: 'University of Denver',
			url: 'https://www.du.edu/',
			logo: 'https://www.du.edu/themes/custom/pl_drupal/logo.svg'
		},
		{
			'@type': 'CollegeOrUniversity',
			name: 'California State University, Chico',
			url: 'https://www.csuchico.edu/'
		}
	],
	hasCredential: [
		{
			'@type': 'EducationalOccupationalCredential',
			name: 'Masters Degree, Philosophy and Religious Studies',
			recognizedBy: {
				'@type': 'CollegeOrUniversity',
				name: 'University of Denver'
			},
			startDate: '2009',
			endDate: '2011',
			description: 'Thesis: Re-visioning the semantic and semiotic registers in the study of culture and religion.'
		},
		{
			'@type': 'EducationalOccupationalCredential',
			name: 'Bachelor’s Degree, Philosophy & Religious Studies',
			recognizedBy: {
				'@type': 'CollegeOrUniversity',
				name: 'California State University, Chico'
			},
			startDate: '1975',
			endDate: '1977'
		}
	],
	publishingPrinciples: [
		'https://jcrt.org/archives/12.3/bedford/',
		'https://jcrt.org/archives/20.1/bedford/'
	],
	works: [
		{
			'@type': 'ScholarlyArticle',
			name: 'Notes on mythological psychology: reimagining the historical psyche',
			author: { '@id': `${canonicalSiteUrl}/#gary-bedford` },
			isPartOf: {
				'@type': 'Periodical',
				name: 'Journal of the American Academy of Religion'
			},
			volumeNumber: '49',
			issueNumber: '2',
			pagination: '231-247',
			datePublished: '1981'
		},
		{
			'@type': 'ScholarlyArticle',
			name: 'Journal for Cultural and Religious Theory article by Gary Bedford',
			url: 'https://jcrt.org/archives/12.3/bedford/',
			author: { '@id': `${canonicalSiteUrl}/#gary-bedford` }
		},
		{
			'@type': 'ScholarlyArticle',
			name: 'Journal for Cultural and Religious Theory article by Gary Bedford',
			url: 'https://jcrt.org/archives/20.1/bedford/',
			author: { '@id': `${canonicalSiteUrl}/#gary-bedford` }
		}
	]
};

export default {
	title: 'Wild Globalization',
	tagline: 'A pan-historical exploration of the six wild forces driving hyper-globalizing civilization.',
	description:
		'A pan-historical exploration of ecology, culture, technology, economy, and governance as wild forces shaping civilization.',
	url: siteUrl,
	noindex: false,
	favicon: '/assets/img/favicon-180.png',
	favicons: [
		{ rel: 'icon', href: '/assets/img/favicon-32.png', sizes: '32x32', type: 'image/png' },
		{ rel: 'icon', href: '/assets/img/favicon-180.png', sizes: '180x180', type: 'image/png' },
		{ rel: 'apple-touch-icon', href: '/assets/img/favicon-180.png', sizes: '180x180' }
	],
	defaultLanguage: 'en',
	author: {
		name: 'Gary Bedford',
		url: garyBedford.url
	},
	organization: {
		name: 'The Wild Globalization Project',
		url: canonicalSiteUrl,
		logo: `${canonicalSiteUrl}/assets/img/logo.png`
	},
	person: garyBedford,
	languages: {
		en: {
			contentDir: 'content/',
			locale: 'en',
			languageName: 'English',
			title: 'Wild Globalization',
			tagline: 'A pan-historical exploration of the six wild forces.'
		}
	},
	head: {
		link: [
			{ rel: 'preload', href: '/assets/css/index.css', as: 'style' },
			{ rel: 'preload', href: '/assets/img/hero-lcp.webp', as: 'image', type: 'image/webp', fetchpriority: 'high' },
			{ rel: 'stylesheet', href: '/assets/css/index.css' },
			{ rel: 'alternate', href: `${canonicalSiteUrl}/feed/firehose.xml`, type: 'application/atom+xml', title: 'Wild Globalization Firehose' },
			{ rel: 'alternate', href: `${canonicalSiteUrl}/feed/feed.xml`, type: 'application/atom+xml', title: 'Wild Globalization Atom Feed' },
			{ rel: 'alternate', href: `${canonicalSiteUrl}/feed/feed.rss`, type: 'application/rss+xml', title: 'Wild Globalization RSS Feed' },
			{ rel: 'alternate', href: `${canonicalSiteUrl}/feed/feed.json`, type: 'application/feed+json', title: 'Wild Globalization JSON Feed' },
			{ rel: 'alternate', href: 'https://explore.wildglobalization.com/feed', type: 'application/atom+xml', title: 'Wild Globalization Explore Feed' }
		],
		script: [{ src: '/assets/js/index.js', defer: true }],
		meta: [
			{ name: 'color-scheme', content: 'dark' },
			{ name: 'theme-color', content: '#11151f' }
		]
	},
	seo: {
		preserveQueryParams: false,
		openGraph: { type: 'website' },
		twitter: { card: 'summary_large_image' }
	},
	structuredData: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${canonicalSiteUrl}/#website`,
				name: 'Wild Globalization',
				url: `${canonicalSiteUrl}/`,
				description: 'A pan-historical exploration of ecology, culture, technology, economy, and governance as wild forces shaping civilization.',
				publisher: { '@id': `${canonicalSiteUrl}/#organization` },
				author: { '@id': `${canonicalSiteUrl}/#gary-bedford` },
				potentialAction: {
					'@type': 'SearchAction',
					target: `${canonicalSiteUrl}/search/?q={search_term_string}`,
					'query-input': 'required name=search_term_string'
				}
			},
			{
				'@type': 'Organization',
				'@id': `${canonicalSiteUrl}/#organization`,
				name: 'The Wild Globalization Project',
				url: `${canonicalSiteUrl}/`,
				logo: `${canonicalSiteUrl}/assets/img/logo.png`,
				sameAs: ['https://explore.wildglobalization.com/'],
				founder: { '@id': `${canonicalSiteUrl}/#gary-bedford` }
			},
			{
				'@type': 'Person',
				'@id': `${canonicalSiteUrl}/#gary-bedford`,
				name: garyBedford.name,
				url: garyBedford.url,
				sameAs: garyBedford.sameAs,
				alumniOf: garyBedford.alumniOf,
				hasCredential: garyBedford.hasCredential,
				knowsAbout: [
					'Globalization',
					'Philosophy and Religious Studies',
					'Cultural and Religious Theory',
					'Wealth management',
					'Estate planning'
				],
				worksFor: { '@id': `${canonicalSiteUrl}/#organization` },
				publishingPrinciples: garyBedford.publishingPrinciples,
				subjectOf: garyBedford.works
			}
		]
	}
};
