export interface Article {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  print_section: string | null;
  print_page: string | null;
  source: string;
  multimedia: any[];
  headline: {
    main: string;
    kicker: string | null;
    content_kicker: string | null;
    print_headline: string | null;
    name: string | null;
    seo: string | null;
    sub: string | null;
  };
  keywords: any[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: {
    original: string | null;
    person: any[];
    organization: string | null;
  };
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}
