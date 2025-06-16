document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const body = document.body;

  if (!toggleBtn || !sidebar) return;

  toggleBtn.setAttribute('aria-expanded', 'false');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click bubbling to body
    const isActive = sidebar.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', String(isActive));
    body.classList.toggle('sidebar-open', isActive);
  });

  // Close sidebar when clicking outside sidebar and toggle button
  body.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      e.target !== toggleBtn
    ) {
      sidebar.classList.remove('active');
      body.classList.remove('sidebar-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
