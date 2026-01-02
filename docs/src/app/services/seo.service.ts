import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'documentation';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly baseUrl = 'https://pegasusheavy.github.io/corevpn';
  private readonly siteName = 'CoreVPN Documentation';
  private readonly defaultImage = '/assets/og-image.png';
  private readonly twitterHandle = '@pegasusheavy';

  /**
   * Update page meta tags for SEO
   */
  updateMeta(pageMeta: PageMeta): void {
    const fullTitle = `${pageMeta.title} | ${this.siteName}`;

    // Basic meta
    this.title.setTitle(fullTitle);
    this.updateTag('description', pageMeta.description);
    this.updateTag('author', pageMeta.author || 'Pegasus Heavy Industries');

    // Keywords
    if (pageMeta.keywords?.length) {
      this.updateTag('keywords', pageMeta.keywords.join(', '));
    }

    // Canonical URL
    const canonicalUrl = pageMeta.canonicalUrl || this.baseUrl;
    this.updateCanonicalUrl(canonicalUrl);

    // Open Graph
    this.updateTag('og:title', fullTitle, 'property');
    this.updateTag('og:description', pageMeta.description, 'property');
    this.updateTag('og:type', pageMeta.ogType || 'website', 'property');
    this.updateTag('og:url', canonicalUrl, 'property');
    this.updateTag('og:image', pageMeta.ogImage || this.defaultImage, 'property');
    this.updateTag('og:site_name', this.siteName, 'property');
    this.updateTag('og:locale', 'en_US', 'property');

    // Article-specific Open Graph
    if (pageMeta.ogType === 'article' || pageMeta.ogType === 'documentation') {
      if (pageMeta.publishedTime) {
        this.updateTag('article:published_time', pageMeta.publishedTime, 'property');
      }
      if (pageMeta.modifiedTime) {
        this.updateTag('article:modified_time', pageMeta.modifiedTime, 'property');
      }
      if (pageMeta.section) {
        this.updateTag('article:section', pageMeta.section, 'property');
      }
    }

    // Twitter Cards
    this.updateTag('twitter:card', 'summary_large_image', 'name');
    this.updateTag('twitter:site', this.twitterHandle, 'name');
    this.updateTag('twitter:creator', this.twitterHandle, 'name');
    this.updateTag('twitter:title', fullTitle, 'name');
    this.updateTag('twitter:description', pageMeta.description, 'name');
    this.updateTag('twitter:image', pageMeta.ogImage || this.defaultImage, 'name');
  }

  /**
   * Add FAQ structured data for AEO
   */
  addFAQSchema(faqs: FAQItem[]): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    this.addJsonLd('faq-schema', schema);
  }

  /**
   * Add HowTo structured data for step-by-step guides
   */
  addHowToSchema(name: string, description: string, steps: HowToStep[], totalTime?: string): void {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name,
      description,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image && { image: step.image }),
      })),
    };

    if (totalTime) {
      schema['totalTime'] = totalTime;
    }

    this.addJsonLd('howto-schema', schema);
  }

  /**
   * Add TechArticle structured data for documentation pages
   */
  addTechArticleSchema(
    headline: string,
    description: string,
    datePublished: string,
    dateModified?: string
  ): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline,
      description,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Organization',
        name: 'Pegasus Heavy Industries',
        url: 'https://github.com/pegasusheavy',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Pegasus Heavy Industries',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/assets/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': this.baseUrl,
      },
    };

    this.addJsonLd('article-schema', schema);
  }

  /**
   * Add SoftwareApplication structured data
   */
  addSoftwareSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'CoreVPN',
      applicationCategory: 'NetworkApplication',
      operatingSystem: 'Linux, Windows, macOS',
      description:
        'OpenVPN-compatible server with OAuth2/SAML authentication, ghost mode for zero-logging, and modern TLS.',
      url: 'https://github.com/pegasusheavy/corevpn',
      downloadUrl: 'https://github.com/pegasusheavy/corevpn/releases',
      softwareVersion: '0.1.0',
      author: {
        '@type': 'Organization',
        name: 'Pegasus Heavy Industries',
      },
      license: 'https://opensource.org/licenses/MIT',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '1',
      },
    };

    this.addJsonLd('software-schema', schema);
  }

  /**
   * Add Documentation structured data
   */
  addDocumentationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      description:
        'Official documentation for CoreVPN - a secure, OpenVPN-compatible VPN server with ghost mode.',
      publisher: {
        '@type': 'Organization',
        name: 'Pegasus Heavy Industries',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    this.addJsonLd('website-schema', schema);
  }

  /**
   * Add BreadcrumbList structured data
   */
  addBreadcrumbSchema(items: { name: string; url: string }[]): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`,
      })),
    };

    this.addJsonLd('breadcrumb-schema', schema);
  }

  /**
   * Clear all structured data
   */
  clearStructuredData(): void {
    const scripts = this.document.querySelectorAll('script[data-schema]');
    scripts.forEach((script) => script.remove());
  }

  private updateTag(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
    const selector = attr === 'property' ? `property="${name}"` : `name="${name}"`;

    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: name, content });
    } else {
      this.meta.addTag({ [attr]: name, content });
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private addJsonLd(id: string, schema: object): void {
    // Remove existing schema with same id
    const existing = this.document.querySelector(`script[data-schema="${id}"]`);
    if (existing) {
      existing.remove();
    }

    // Add new schema
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema', id);
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
