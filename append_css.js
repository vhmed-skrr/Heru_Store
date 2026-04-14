const fs = require('fs');
const css = `
.social-links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.social-link:hover {
  border-color: var(--border-accent);
  color: var(--accent);
  background: var(--accent-dim);
  transform: translateY(-2px);
}

.social-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
`;
fs.appendFileSync('d:/web/heru-store v2/assets/css/components.css', css);
