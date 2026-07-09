<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title><xsl:value-of select="atom:feed/atom:title"/></title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<style type="text/css">
					body{font-family:system-ui,sans-serif;line-height:1.6;max-width:60rem;margin:2rem auto;padding:0 1rem;background:#fff;color:#111}
					a{color:#0b57d0;text-decoration:none}
					a:hover{text-decoration:underline}
					article{padding:1rem 0;border-bottom:1px solid #e5e7eb}
					small{color:#6b7280}
				</style>
			</head>
			<body>
				<h1><xsl:value-of select="atom:feed/atom:title"/></h1>
				<p><xsl:value-of select="atom:feed/atom:subtitle"/></p>
				<xsl:apply-templates select="atom:feed/atom:entry" />
			</body>
		</html>
	</xsl:template>
	<xsl:template match="atom:feed/atom:entry">
		<article>
			<h2>
				<a>
					<xsl:attribute name="href"><xsl:value-of select="atom:link/@href"/></xsl:attribute>
					<xsl:value-of select="atom:title"/>
				</a>
			</h2>
			<small><xsl:value-of select="atom:updated"/></small>
		</article>
	</xsl:template>
</xsl:stylesheet>