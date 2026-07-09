import yaml from 'js-yaml';
import settings from './src/_data/settings.js';
import markdownIt from 'markdown-it';
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import markdownItImageFigures from "markdown-it-image-figures";
import pluginTOC from 'eleventy-plugin-toc';
import { IdAttributePlugin } from '@11ty/eleventy'; 
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import { execSync } from 'child_process';
const siteUrl = settings.url.replace(/\/$/, '');
const SITE_TIME_ZONE = 'America/Denver';
const SITE_TIME_ZONE_CITY = 'Denver';
const EXPLORE_FEED_URL = 'https://explore.wildglobalization.com/feed';
const EXPLORE_FEED_LIMIT = 50;
const FEED_FETCH_TIMEOUT_MS = 8000;

process.env.TZ = SITE_TIME_ZONE;

function absoluteUrl(path = '/') {
	return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function decodeEntities(value = '') {
	let decoded = String(value);
	for (let i = 0; i < 100; i += 1) {
		const next = decoded
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
		.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, ' ');
		if (next === decoded) break;
		decoded = next;
	}
	return decoded;
}

function excerpt(content = '') {
	return decodeEntities(String(content)
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 240));
}

function createMemoizedRenderer(renderFn) {
	const cache = new Map();
	return (content) => {
		if (cache.has(content)) return cache.get(content);
		const result = renderFn(content);
		cache.set(content, result);
		return result;
	};
}

function toDate(value) {
	if (!value) return null;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function isDateOnlyValue(value) {
	if (typeof value === 'string') return /^\d{4}-\d{2}-\d{2}$/.test(value);
	if (!(value instanceof Date)) return false;
	return value.getUTCHours() === 0 && value.getUTCMinutes() === 0 && value.getUTCSeconds() === 0 && value.getUTCMilliseconds() === 0;
}

function padNumber(value, length = 2) {
	return String(value).padStart(length, '0');
}

function getTimeZoneOffsetMinutes(date, timeZone = SITE_TIME_ZONE) {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		timeZoneName: 'shortOffset',
		hour: '2-digit',
	}).formatToParts(date);
	const offsetPart = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT';
	const match = offsetPart.match(/^GMT(?:(?<sign>[+-])(?<hours>\d{1,2})(?::(?<minutes>\d{2}))?)?$/);
	if (!match?.groups?.sign) return 0;
	const sign = match.groups.sign === '-' ? -1 : 1;
	const hours = Number(match.groups.hours || 0);
	const minutes = Number(match.groups.minutes || 0);
	return sign * (hours * 60 + minutes);
}

function getZonedParts(date, timeZone = SITE_TIME_ZONE) {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(date);
	return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
}

function getDateOnlyParts(value) {
	const date = toDate(value);
	if (!date) return null;
	return {
		year: String(date.getUTCFullYear()),
		month: padNumber(date.getUTCMonth() + 1),
		day: padNumber(date.getUTCDate()),
		hour: '00',
		minute: '00',
		second: '00',
	};
}

function localDateTimeToUtc(parts, timeZone = SITE_TIME_ZONE) {
	const localUtcGuess = Date.UTC(
		Number(parts.year),
		Number(parts.month) - 1,
		Number(parts.day),
		Number(parts.hour || 0),
		Number(parts.minute || 0),
		Number(parts.second || 0),
	);
	const firstOffset = getTimeZoneOffsetMinutes(new Date(localUtcGuess), timeZone);
	const firstUtc = localUtcGuess - firstOffset * 60_000;
	const secondOffset = getTimeZoneOffsetMinutes(new Date(firstUtc), timeZone);
	return new Date(localUtcGuess - secondOffset * 60_000);
}

function formatOffset(minutes) {
	const sign = minutes < 0 ? '-' : '+';
	const absolute = Math.abs(minutes);
	return `${sign}${padNumber(Math.floor(absolute / 60))}:${padNumber(absolute % 60)}`;
}

function formatReadableDate(value) {
	const date = toDate(value);
	if (!date) return '';
	if (isDateOnlyValue(value)) {
		const parts = getDateOnlyParts(value);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC',
		}).format(new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day))));
	}
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: SITE_TIME_ZONE,
	}).format(date);
}

function formatDateYear(value) {
	const date = toDate(value);
	if (!date) return '';
	if (isDateOnlyValue(value)) return getDateOnlyParts(value).year;
	return getZonedParts(date).year;
}

function formatRfc3339(value) {
	const date = toDate(value);
	if (!date) return '';
	const parts = isDateOnlyValue(value) ? getDateOnlyParts(value) : getZonedParts(date);
	const instant = isDateOnlyValue(value) ? localDateTimeToUtc(parts) : date;
	const offset = getTimeZoneOffsetMinutes(instant);
	return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${formatOffset(offset)}`;
}

function formatRfc822(value) {
	const date = toDate(value);
	if (!date) return '';
	if (isDateOnlyValue(value)) return localDateTimeToUtc(getDateOnlyParts(value)).toUTCString();
	return date.toUTCString();
}

function unwrapCdata(value = '') {
	const trimmed = String(value).trim();
	const match = trimmed.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
	return match ? match[1] : trimmed;
}

function extractXmlTag(source = '', tagName) {
	const pattern = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
	const match = source.match(pattern);
	return match ? unwrapCdata(match[1]) : '';
}

function cdataEscape(value = '') {
	return String(value).replaceAll(']]>', ']]]]><![CDATA[>');
}

function xmlEscape(value = '') {
	return decodeEntities(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function parseExploreFeed(xml = '') {
	const items = [...String(xml).matchAll(/<item\b[\s\S]*?<\/item>/gi)].slice(0, EXPLORE_FEED_LIMIT);
	return items.map((match) => {
		const item = match[0];
		const title = decodeEntities(extractXmlTag(item, 'title'));
		const link = decodeEntities(extractXmlTag(item, 'link'));
		const guid = decodeEntities(extractXmlTag(item, 'guid'));
		const pubDate = decodeEntities(extractXmlTag(item, 'pubDate'));
		const description = extractXmlTag(item, 'description');
		const content = extractXmlTag(item, 'content:encoded') || description;
		const date = toDate(pubDate) || new Date();

		return {
			source: 'explore',
			title,
			url: link,
			id: guid || link,
			date,
			summary: excerpt(description),
			content,
		};
	}).filter((entry) => entry.title && entry.url);
}

async function fetchExploreFeedEntries() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FEED_FETCH_TIMEOUT_MS);

	try {
		const response = await fetch(EXPLORE_FEED_URL, {
			headers: { 'user-agent': 'wildglobalization-feed-importer/1.0' },
			signal: controller.signal,
		});

		if (!response.ok) {
			console.warn(`[feeds] Could not fetch ${EXPLORE_FEED_URL}: ${response.status} ${response.statusText}`);
			return [];
		}

		return parseExploreFeed(await response.text());
	} catch (error) {
		console.warn(`[feeds] Could not fetch ${EXPLORE_FEED_URL}: ${error.message}`);
		return [];
	} finally {
		clearTimeout(timeout);
	}
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.ignores.add("src/assets/**/.DS_Store");
	eleventyConfig.ignores.add("src/assets/**/.*imageoptim*");

	const markdownLib = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	})
		.use(markdownItAttrs)
		.use(markdownItFootnote)
		.use(markdownItImageFigures, {
			figcaption: "title",
			lazy: true,
			async: true,
			classes: "responsive-image__img",
		})
		.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});

	const defaultImageRule = markdownLib.renderer.rules.image || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
	markdownLib.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (!token.attrGet("loading")) token.attrSet("loading", "lazy");
		if (!token.attrGet("decoding")) token.attrSet("decoding", "async");
		return defaultImageRule(tokens, idx, options, env, self);
	};

	eleventyConfig.addCollection('blog', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/blog/**/*.{html,md,njk}')
			.filter((item) => item.url !== '/blog/' && item.data.draft !== true)
			.sort((a, b) => b.date - a.date);
	});

	eleventyConfig.addCollection('pages', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/pages/**/*.{md,njk}')
			.filter((item) => item.data.draft !== true && item.data.showInPagesNav === true)
			.sort((a, b) => {
				const orderA = a.data.timelineOrder ?? 999;
				const orderB = b.data.timelineOrder ?? 999;
				return orderA - orderB || a.data.title.localeCompare(b.data.title);
			});
	});

	eleventyConfig.addCollection('timelinePages', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/pages/**/*.{md,njk}')
			.filter((item) => item.data.draft !== true && item.data.showInTimeline === true)
			.sort((a, b) => {
				const orderA = a.data.timelineOrder ?? 999;
				const orderB = b.data.timelineOrder ?? 999;
				return orderA - orderB || a.data.title.localeCompare(b.data.title);
			});
	});

	eleventyConfig.on('eleventy.after', () => {
		if (process.argv.includes('--serve')) return;
		execSync(`npx pagefind --site _site --glob "**/*.html"`, { encoding: 'utf-8' });
	});

	eleventyConfig.setLibrary("md", markdownLib);

	const renderMd = createMemoizedRenderer((content) => markdownLib.render(content || ""));
	eleventyConfig.addFilter("md", (content) => renderMd(content || ""));
	eleventyConfig.addFilter("markdownify", (content) => renderMd(content || ""));
	eleventyConfig.addFilter("markdown", (content) => markdownLib.render(content || ""));

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4", "h5"],
		id: "toci",
		class: "list-group",
		ul: true,
		flat: true,
		wrapper: "div",
	});

	eleventyConfig.addPlugin(IdAttributePlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["webp"],
		widths: ["auto"],
		urlPath: "/assets/img/optimized/",
		outputDir: "_site/assets/img/optimized/",
		sharpWebpOptions: {
			quality: 72,
		},
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
		},
	});
	eleventyConfig.addTransform("stripOptimizedImageSrcset", function (content) {
		if (!this.page.outputPath?.endsWith(".html")) return content;
		return content.replace(
			/(<img\b(?=[^>]*\bsrc="\/assets\/img\/optimized\/[^"]+\.webp")[^>]*?)\s+srcset="[^"]*"/g,
			"$1",
		);
	});

	eleventyConfig.addShortcode("currentBuildDate", () => formatRfc3339(new Date()));

	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
	eleventyConfig.addPassthroughCopy({ "src/content/feed/pretty-atom-feed.xsl": "feed/pretty-atom-feed.xsl" });

	eleventyConfig.addDataExtension('yml,yaml', (contents) => yaml.load(contents));

	eleventyConfig.addGlobalData('buildDate', new Date());
	eleventyConfig.addGlobalData('siteTimeZone', {
		name: SITE_TIME_ZONE,
		city: SITE_TIME_ZONE_CITY,
	});
	eleventyConfig.addGlobalData('exploreFeedEntries', async () => fetchExploreFeedEntries());
	eleventyConfig.addFilter('readableDate', formatReadableDate);
	eleventyConfig.addFilter('dateYear', formatDateYear);
	eleventyConfig.addFilter('absoluteUrl', absoluteUrl);
	eleventyConfig.addFilter('fullUrl', absoluteUrl);
	eleventyConfig.addFilter('excerpt', excerpt);
	eleventyConfig.addFilter('plainText', decodeEntities);
	eleventyConfig.addFilter('urlencode', (value) => encodeURIComponent(String(value ?? '')));
	eleventyConfig.addFilter('cdataEscape', cdataEscape);
	eleventyConfig.addFilter('xmlEscape', xmlEscape);
	eleventyConfig.addFilter('dateToRfc3339', formatRfc3339);
	eleventyConfig.addFilter('dateToRfc822', formatRfc822);
	eleventyConfig.addFilter('json', (value) => JSON.stringify(value));
	eleventyConfig.addFilter('limit', (array, count) => array.slice(0, count));
}

export const config = {
	dir: {
		input: "src",
		output: "_site",
		includes: "_includes",
		data: "_data"
	},
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk"
};
