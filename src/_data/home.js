export default {
	nav: [
		{ label: 'The Book', href: '#book' },
		{ label: 'About', href: '#about' },
		{ label: 'The Author', href: '#author' },
		{ label: 'Blog', href: '/blog/' },
		{
			label: 'Wild Globalization',
			href: '#',
			children: [
				{ label: 'Welcome', href: '/welcome/' },
				{ label: 'Opening Act', href: '/opening-act/' },
				{ label: 'Wild Globalization 1.0', href: '/wild-globalization-1-0/' },
				{ label: 'Wild Globalization 2.0', href: '/wild-globalization-2-0/' },
				{ label: 'Hints', href: '/hints/' },
				{ label: 'About the Author', href: '/about-the-author/' }
			]
		},
		{
			label: 'Six Forces',
			href: '#',
			children: [
				{ label: 'Wild Ecology', href: '/wild-ecology/' },
				{ label: 'Wild Sex & Culture', href: '/wild-sex-culture/' },
				{ label: 'Wild Tech', href: '/wild-tech/' },
				{ label: 'Wild Economy', href: '/wild-economy/' },
				{ label: 'Wild Governance', href: '/wild-governance/' }
			]
		},
		{ label: 'Timeline', href: '/timeline/' }
	]
};
