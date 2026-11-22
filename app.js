/* app.js - React components for the landing page.
   React is loaded from a CDN in index.php, so there is no build step:
   components use React.createElement directly instead of JSX.

   >>> EDIT YOUR TEXT IN THE "SITE" OBJECT BELOW. <<< */
(function () {
  'use strict';

  var SITE = {
    brand: 'LOGO',
    title: 'BUSINESS',
    subtitle: 'LANDING PAGE',
    intro: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
    photoAlt: 'Colleagues working together in an office',

    about: {
      heading: 'About',
      lead: 'Who we are',
      text: [
        'We help small and mid-sized companies plan, launch and grow. Replace this text with a short description of your business, what you offer and who you work with.',
        'Keep it to two short paragraphs: what you do, then why clients choose you.'
      ],
      points: [
        { title: 'Clear planning', text: 'A written scope, timeline and price before any work starts.' },
        { title: 'Reliable delivery', text: 'One point of contact and regular progress updates.' },
        { title: 'Support after launch', text: 'We stay available once the project is live.' }
      ]
    },

    team: {
      heading: 'Team',
      lead: 'The people behind the work',
      members: [
        { name: 'Name Surname', role: 'Founder' },
        { name: 'Name Surname', role: 'Operations' },
        { name: 'Name Surname', role: 'Design' }
      ]
    },

    faq: {
      heading: 'FAQ',
      lead: 'Common questions',
      items: [
        { q: 'How do I get started?', a: 'Send us a message from the Contacts section. We reply with next steps within one business day.' },
        { q: 'How long does a project take?', a: 'It depends on the scope. We give you a timeline after a short intro call.' },
        { q: 'Do you work with small teams?', a: 'Yes. We work with teams of every size.' },
        { q: 'How does pricing work?', a: 'You get a fixed quote after we agree on the scope.' }
      ]
    },

    contact: {
      heading: 'Contacts',
      lead: 'Send us a message',
      details: [
        { label: 'Email', value: 'hello@example.com' },
        { label: 'Phone', value: '+00 000 000 0000' },
        { label: 'Address', value: '123 Your Street, Your City' },
        { label: 'Hours', value: 'Mon to Fri, 9:00 to 17:00' }
      ]
    }
  };

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var h = React.createElement;
  var cfg = window.APP_CONFIG || {};

  var NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'faq', label: 'FAQ' },
    { id: 'team', label: 'Team' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'about', label: 'About' }
  ];

  /* ---------- Smooth scrolling ---------- */
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (window.history && history.replaceState) history.replaceState(null, '', '#' + id);
  }

  /* ---------- Navigation ---------- */
  function NavLinks(props) {
    return h('ul', { id: props.id, className: 'nav__links' + (props.open ? ' is-open' : '') },
      NAV_ITEMS.map(function (item) {
        var isActive = props.active === item.id;
        return h('li', { key: item.id },
          h('a', {
            href: '#' + item.id,
            className: 'nav__link' + (isActive ? ' is-active' : ''),
            'aria-current': isActive ? 'true' : undefined,
            onClick: function (e) { e.preventDefault(); props.onNavigate(item.id); }
          }, item.label));
      }));
  }

  function Navbar(props) {
    var open = useState(false);
    var isOpen = open[0], setOpen = open[1];

    function go(id) { setOpen(false); props.onNavigate(id); }

    return h('nav', { className: 'nav', 'aria-label': 'Main' },
      h('button', {
        className: 'nav__toggle', type: 'button',
        'aria-expanded': isOpen, 'aria-controls': 'nav-links',
        'aria-label': isOpen ? 'Close menu' : 'Open menu',
        onClick: function () { setOpen(!isOpen); }
      }, h('span'), h('span'), h('span')),
      h(NavLinks, { id: 'nav-links', open: isOpen, active: props.active, onNavigate: go }),
      h('a', { className: 'nav__logo', href: '#home', onClick: function (e) { e.preventDefault(); go('home'); } }, SITE.brand));
  }

  /* Slim bar that appears on desktop once the hero has scrolled away. */
  function StickyBar(props) {
    return h('div', { className: 'sticky' + (props.visible ? ' is-visible' : ''), 'aria-hidden': props.visible ? undefined : 'true' },
      h('nav', { className: 'sticky__inner', 'aria-label': 'Quick navigation' },
        h(NavLinks, { active: props.active, onNavigate: props.onNavigate }),
        h('a', { className: 'nav__logo', href: '#home', tabIndex: props.visible ? 0 : -1,
                 onClick: function (e) { e.preventDefault(); props.onNavigate('home'); } }, SITE.brand)));
  }

  /* ---------- Hero ---------- */
  function Hero(props) {
    return h('header', { id: 'home', className: 'frame' },
      h('div', { className: 'shape shape--a', 'aria-hidden': 'true' }),
      h(Navbar, { active: props.active, onNavigate: props.onNavigate }),
      h('div', { className: 'hero' },
        h('h1', { className: 'hero__title' },
          h('span', { className: 'hero__word' }, SITE.title),
          h('span', { className: 'hero__sub' }, SITE.subtitle)),
        h('p', { className: 'hero__text' }, SITE.intro),
        h('a', {
          className: 'hero__cta', href: '#about',
          onClick: function (e) { e.preventDefault(); props.onNavigate('about'); }
        }, 'READ MORE')),
      h('div', { className: 'photo', role: 'img', 'aria-label': SITE.photoAlt }),
      h('div', { className: 'shape shape--b', 'aria-hidden': 'true' }),
      h('div', { className: 'shape shape--c', 'aria-hidden': 'true' }),
      h('div', { className: 'band', 'aria-hidden': 'true' })
    );
  }

  /* ---------- Sections ---------- */
  function SectionHead(props) {
    return h('div', { className: 'panel__head' },
      h('h2', null, props.heading),
      h('p', { className: 'panel__lead' }, props.lead));
  }

  function About() {
    var a = SITE.about;
    return h('section', { id: 'about', className: 'panel', 'aria-labelledby': 'about-h' },
      h('div', { className: 'panel__head' },
        h('h2', { id: 'about-h' }, a.heading),
        h('p', { className: 'panel__lead' }, a.lead)),
      h('div', { className: 'split' },
        h('div', { className: 'prose' }, a.text.map(function (t, i) { return h('p', { key: i }, t); })),
        h('ul', { className: 'points' }, a.points.map(function (p, i) {
          return h('li', { key: i }, h('strong', null, p.title), h('span', null, p.text));
        }))));
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }

  function Team() {
    var t = SITE.team;
    return h('section', { id: 'team', className: 'panel', 'aria-labelledby': 'team-h' },
      h('div', { className: 'panel__head' },
        h('h2', { id: 'team-h' }, t.heading),
        h('p', { className: 'panel__lead' }, t.lead)),
      h('ul', { className: 'team' }, t.members.map(function (m, i) {
        return h('li', { key: i },
          h('span', { className: 'team__avatar', 'aria-hidden': 'true' }, initials(m.name)),
          h('strong', null, m.name),
          h('span', { className: 'team__role' }, m.role));
      })));
  }

  function Faq() {
    var f = SITE.faq;
    return h('section', { id: 'faq', className: 'panel faq', 'aria-labelledby': 'faq-h' },
      h('div', { className: 'panel__head' },
        h('h2', { id: 'faq-h' }, f.heading),
        h('p', { className: 'panel__lead' }, f.lead)),
      f.items.map(function (it, i) {
        return h('details', { key: i }, h('summary', null, it.q), h('p', null, it.a));
      }));
  }

  /* ---------- Contact form ---------- */
  var EMPTY = { name: '', email: '', message: '', website: '' };
  var MAX_MESSAGE = 2000;

  function validate(v) {
    var e = {};
    var name = v.name.trim(), email = v.email.trim(), msg = v.message.trim();
    if (name.length < 2 || name.length > 80) e.name = 'Enter your name (2 to 80 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) e.email = 'Enter a valid email address.';
    if (msg.length < 10 || msg.length > MAX_MESSAGE) e.message = 'Write a message between 10 and ' + MAX_MESSAGE + ' characters.';
    return e;
  }

  function Field(props) {
    var id = 'f-' + props.name;
    var err = props.error;
    var common = {
      id: id, name: props.name, value: props.value, onChange: props.onChange,
      'aria-invalid': err ? 'true' : 'false',
      'aria-describedby': err ? id + '-err' : undefined
    };
    var control = props.multiline
      ? h('textarea', Object.assign({ rows: 5, maxLength: MAX_MESSAGE }, common))
      : h('input', Object.assign({ type: props.type || 'text', autoComplete: props.autoComplete }, common));
    return h('label', { htmlFor: id }, props.label, control,
      props.multiline ? h('span', { className: 'form__count' }, props.value.length + ' / ' + MAX_MESSAGE) : null,
      err ? h('span', { id: id + '-err', className: 'form__error' }, err) : null);
  }

  function ContactForm() {
    var vs = useState(EMPTY), values = vs[0], setValues = vs[1];
    var es = useState({}), errors = es[0], setErrors = es[1];
    var ss = useState({ state: 'idle', message: '' }), status = ss[0], setStatus = ss[1];

    function onChange(e) {
      var next = Object.assign({}, values);
      next[e.target.name] = e.target.value;
      setValues(next);
    }

    function onSubmit(e) {
      e.preventDefault();
      var errs = validate(values);
      setErrors(errs);
      if (Object.keys(errs).length) {
        setStatus({ state: 'error', message: 'Please fix the highlighted fields.' });
        return;
      }
      setStatus({ state: 'sending', message: 'Sending...' });

      fetch(cfg.contactEndpoint || 'api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ csrf: cfg.csrf || '' }, values))
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok && data.ok) {
            setValues(EMPTY);
            setErrors({});
            setStatus({ state: 'success', message: data.message || 'Message sent.' });
          } else {
            setErrors(data.errors || {});
            setStatus({ state: 'error', message: data.message || 'Something went wrong. Please try again.' });
          }
        });
      }).catch(function () {
        setStatus({ state: 'error', message: 'Could not reach the server. Make sure Apache is running and open the page through http://localhost/.' });
      });
    }

    return h('form', { className: 'form', onSubmit: onSubmit, noValidate: true },
      h(Field, { name: 'name', label: 'Name', value: values.name, onChange: onChange, error: errors.name, autoComplete: 'name' }),
      h(Field, { name: 'email', label: 'Email', type: 'email', value: values.email, onChange: onChange, error: errors.email, autoComplete: 'email' }),
      h(Field, { name: 'message', label: 'Message', multiline: true, value: values.message, onChange: onChange, error: errors.message }),
      /* Honeypot: hidden from people, bots tend to fill it in. */
      h('div', { className: 'hp', 'aria-hidden': 'true' },
        h('label', null, 'Leave this empty',
          h('input', { name: 'website', tabIndex: -1, autoComplete: 'off', value: values.website, onChange: onChange }))),
      h('button', { className: 'hero__cta', type: 'submit', disabled: status.state === 'sending' }, 'SEND MESSAGE'),
      h('p', { className: 'form__status' + (status.state === 'error' ? ' is-error' : status.state === 'success' ? ' is-ok' : ''),
               role: 'status', 'aria-live': 'polite' }, status.message));
  }

  function Contacts() {
    var c = SITE.contact;
    return h('section', { id: 'contacts', className: 'panel', 'aria-labelledby': 'contacts-h' },
      h('div', { className: 'panel__head' },
        h('h2', { id: 'contacts-h' }, c.heading),
        h('p', { className: 'panel__lead' }, c.lead)),
      h('div', { className: 'split split--form' },
        h('dl', { className: 'details' }, c.details.map(function (d, i) {
          return h('div', { key: i }, h('dt', null, d.label), h('dd', null, d.value));
        })),
        h(ContactForm)));
  }

  function Footer() {
    return h('footer', { className: 'footer' },
      h('p', null, 'designed by freepik'),
      h('p', { className: 'footer__copy' }, '\u00A9 ' + (cfg.year || new Date().getFullYear()) + ' ' + SITE.brand + '. All rights reserved.'));
  }

  /* ---------- App ---------- */
  function App() {
    var as = useState('home'), active = as[0], setActive = as[1];
    var vis = useState(false), showBar = vis[0], setShowBar = vis[1];
    var lock = useRef(null);

    function navigate(id) {
      lock.current = { id: id, timer: null };
      setActive(id);
      goTo(id);
    }

    /* Highlight the nav link of the section in view; a nav click keeps its link active while scrolling. */
    useEffect(function () {
      var ids = ['home', 'about', 'team', 'faq', 'contacts'];

      function onScroll() {
        var hero = document.getElementById('home');
        setShowBar(hero ? hero.getBoundingClientRect().bottom < 0 : false);

        if (lock.current) {
          clearTimeout(lock.current.timer);
          lock.current.timer = setTimeout(function () { lock.current = null; }, 150);
          return;
        }
        var current = 'home';
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140) current = id;
        });
        setActive(current);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);

    /* Honour a #hash in the URL on first load. */
    useEffect(function () {
      var id = (location.hash || '').replace('#', '');
      if (id && document.getElementById(id)) setTimeout(function () { goTo(id); }, 50);
    }, []);

    return h(React.Fragment, null,
      h(StickyBar, { visible: showBar, active: active, onNavigate: navigate }),
      h('div', { className: 'page' },
        h(Hero, { active: active, onNavigate: navigate }),
        h('main', null, h(About), h(Team), h(Faq), h(Contacts)),
        h(Footer)));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
