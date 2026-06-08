export type Publication = {
  title: string;
  authors: string;
  year: number;
  venue: string;
  type: 'paper' | 'patent';
  citations?: number;
  link?: string;
  // Curated subset shown under "Selected publications and patents" on /about.
  selected?: boolean;
};

// Full list from Google Scholar (newest first; ties broken by citation count).
// Single source of truth for the /publications page and the selected list on
// /about. Granted patents link to Google Patents by number; pending
// applications have no stable public URL and are left unlinked. Author strings
// mirror Scholar verbatim, including its "et al." truncation on long lists.
export const publications: Publication[] = [
  { title: 'Autonomous conversational AI system without any configuration by a human', authors: 'A Kelkar, N Varghese, C Khatri, U Mittal, N Rajpurohit, P Relan, H Tran', year: 2025, venue: 'US Patent 12,282,743', type: 'patent', citations: 26, link: 'https://patents.google.com/patent/US12282743', selected: true },
  { title: 'Towards automatic evaluation of task-oriented dialogue flows', authors: 'M Mirtaheri, N Varghese, C Khatri, A Kelkar', year: 2024, venue: 'arXiv:2411.10416', type: 'paper', citations: 1, link: 'https://arxiv.org/abs/2411.10416' },
  { title: 'KULCQ: An Unsupervised Keyword-based Utterance Level Clustering Quality Metric', authors: 'P Guruprasad, N Mokhberian, N Varghese, C Khatri, A Kelkar', year: 2024, venue: 'arXiv:2411.09853', type: 'paper', citations: 0, link: 'https://arxiv.org/abs/2411.09853' },
  { title: 'System and method for supporting ad hoc multilingual natural language database questions', authors: 'P Relan, A Kelkar, N Rajpurohit, U Mittal, H Tran', year: 2022, venue: 'US Patent App. 17/328,552', type: 'patent', citations: 8 },
  { title: 'Cognitive Homeostatic Agents', authors: 'A Kelkar', year: 2021, venue: 'AAMAS 2021', type: 'paper', citations: 5, link: 'https://aamas.csc.liv.ac.uk/Proceedings/aamas2021/pdfs/p12.pdf', selected: true },
  { title: 'Bertrand-DR: Improving Text-to-SQL using a Discriminative Re-ranker', authors: 'A Kelkar, R Relan, V Bhardwaj, S Vaichal, C Khatri, P Relan', year: 2020, venue: 'arXiv:2002.00557', type: 'paper', citations: 34, link: 'https://arxiv.org/abs/2002.00557', selected: true },
  { title: 'Generation of complex database queries and API calls from natural language utterances', authors: 'A Kelkar, N Rajpurohit, U Mittal, P Relan', year: 2020, venue: 'arXiv:2012.08146', type: 'paper', citations: 1, link: 'https://arxiv.org/abs/2012.08146' },
  { title: 'Extended cascading style sheets', authors: 'AS Kelkar, JA Horne, R Parsell', year: 2016, venue: 'US Patent 9,229,915', type: 'patent', citations: 1, link: 'https://patents.google.com/patent/US9229915' },
  { title: 'Structural editing operations for network forms', authors: 'AS Kelkar, BG O\'Connor, JE Rivers-Moore, P Sikchi', year: 2011, venue: 'US Patent 7,937,651', type: 'patent', citations: 45, link: 'https://patents.google.com/patent/US7937651', selected: true },
  { title: 'Multi-format centralized distribution of localized resources for multiple products', authors: 'RD Parsell, H Anan, TJ McCracken, A Kelkar', year: 2011, venue: 'US Patent 8,069,433', type: 'patent', citations: 19, link: 'https://patents.google.com/patent/US8069433' },
  { title: 'Extended cascading style sheets', authors: 'AS Kelkar, JA Horne, R Parsell', year: 2011, venue: 'US Patent 7,941,746', type: 'patent', citations: 9, link: 'https://patents.google.com/patent/US7941746' },
  { title: 'Executing applications at appropriate trust levels', authors: 'NW Stott, AS Kelkar, BG O\'Connor, LB Rosenberg, A Catorcini, et al.', year: 2010, venue: 'US Patent 7,676,843', type: 'patent', citations: 38, link: 'https://patents.google.com/patent/US7676843' },
  { title: 'Executing applications at appropriate trust levels', authors: 'NW Stott, AS Kelkar, BG O\'Connor, LB Rosenberg, A Catorcini, et al.', year: 2010, venue: 'US Patent 7,774,620', type: 'patent', citations: 32, link: 'https://patents.google.com/patent/US7774620' },
  { title: 'Data-driven actions for network forms', authors: 'AS Kelkar, D van Velzen, D Airapetyan, JE Rivers-Moore, R Aggarwal', year: 2010, venue: 'US Patent 7,673,228', type: 'patent', citations: 30, link: 'https://patents.google.com/patent/US7673228' },
  { title: 'Data-Driven Actions For Network Forms', authors: 'AS Kelkar, D van Velzen, D Airapetyan, JE Rivers-Moore, R Aggarwal', year: 2010, venue: 'US Patent App. 12/694,836', type: 'patent', citations: 16 },
  { title: 'Template for rendering an electronic form', authors: 'AS Kelkar, D van Velzen, JE Rivers-Moore', year: 2009, venue: 'US Patent 7,543,228', type: 'patent', citations: 122, link: 'https://patents.google.com/patent/US7543228', selected: true },
  { title: 'Methods and systems for exchanging and rendering forms', authors: 'AS Kelkar, D Airapetyan, P Sikchi', year: 2009, venue: 'US Patent 7,509,353', type: 'patent', citations: 13, link: 'https://patents.google.com/patent/US7509353' },
  { title: 'Run-once static content generation using a descriptive file path', authors: 'R Parsell, A Kelkar', year: 2009, venue: 'US Patent App. 11/823,577', type: 'patent', citations: 7 },
  { title: 'Scaling self-organizing maps to model large cortical networks', authors: 'JA Bednar, A Kelkar, R Miikkulainen', year: 2004, venue: 'Neuroinformatics 2(3)', type: 'paper', citations: 45, selected: true },
  { title: 'Modeling large cortical networks with growing self-organizing maps', authors: 'JA Bednar, A Kelkar, R Miikkulainen', year: 2002, venue: 'Neurocomputing 44', type: 'paper', citations: 33, link: 'https://nn.cs.utexas.edu/downloads/papers/bednar.cns01.pdf', selected: true },
];

export const scholar = {
  url: 'https://scholar.google.com/citations?user=qKZ2VRAAAAAJ&hl=en',
};
