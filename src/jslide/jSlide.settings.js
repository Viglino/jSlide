const settings = {
  title: { type: 'text', default: 'jSlide' },
  description: { type: 'text', default: '' },
  fontSize: { type: 'number', default: 35 },
  footer: { type: 'text', default: '| %TITLE% | %PAGE%/%LENGTH%', },
  format: { type: 'select', vals: ['4:3','16:9'], default: '4:3' },
  delay: { type: 'number', default: 3000 },
  loop: { type: 'checkbox', default: false }
}

export default settings
