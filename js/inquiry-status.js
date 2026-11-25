(() => {
  const client = window.getJwbSupabase?.();
  const statusKeys = {
    received: 'inquiryReceived', consulting: 'inquiryConsulting', in_progress: 'inquiryInProgress',
    review: 'inquiryReview', completed: 'inquiryCompleted', on_hold: 'inquiryOnHold',
  };
  const stages = ['received', 'consulting', 'in_progress', 'review', 'completed'];
  const t = key => window.JWB_I18N?.t(key) || key;
  const dateLabel = value => new Date(value).toLocaleString(document.documentElement.lang || 'ko', { dateStyle: 'medium', timeStyle: 'short' });

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('progress-check-form');
    if (!form) return;
    const input = document.getElementById('tracking-code');
    const issueInput = document.getElementById('issue-number');
    const feedback = document.getElementById('progress-feedback');
    const resultRoot = document.getElementById('progress-result');
    let currentProgress = null;
    const renderProgress = progress => {
      const statusKey = statusKeys[progress.status] || 'inquiryReceived';
      document.getElementById('progress-project').textContent = progress.project_label || t('inquiryStatusProject');
      document.getElementById('progress-status').textContent = t(statusKey);
      document.getElementById('progress-updated').textContent = `${t('inquiryStatusUpdated')} · ${dateLabel(progress.updated_at)}`;
      const note = document.getElementById('progress-note');
      note.textContent = progress.progress_note || ''; note.hidden = !progress.progress_note;
      const activeIndex = stages.indexOf(progress.status);
      const track = document.getElementById('inquiry-progress-track');
      track.replaceChildren(...stages.map((stage, index) => {
        const node = document.createElement('span'); node.className = 'inquiry-progress-stage';
        if (progress.status !== 'on_hold' && activeIndex >= index) node.classList.add('is-reached');
        if (progress.status !== 'on_hold' && activeIndex === index) node.classList.add('is-current');
        const dot = document.createElement('i'); dot.setAttribute('aria-hidden', 'true');
        const label = document.createElement('small'); label.textContent = t(statusKeys[stage]);
        node.append(dot, label); return node;
      }));
      resultRoot.hidden = false;
    };
    window.addEventListener('jwb:languagechange', () => { if (currentProgress && !resultRoot.hidden) renderProgress(currentProgress); });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const code = input.value.trim().toUpperCase().replace(/\s+/g, '');
      const issueNumber = issueInput.value.trim().replace(/\s+/g, '');
      input.value = code;
      resultRoot.hidden = true;
      feedback.textContent = t('inquiryStatusLoading');
      if (!client) { feedback.textContent = t('inquiryStatusError'); return; }
      try {
        const { data, error } = await client.functions.invoke('check-inquiry-progress', { body: { code, issue_number: issueNumber } });
        if (error) {
          const responseStatus = Number(error.context?.status || error.context?.statusCode);
          feedback.textContent = responseStatus === 404 ? t('inquiryStatusNotFound') : t('inquiryStatusError');
          return;
        }
        if (data?.error || !data?.progress) {
          feedback.textContent = t('inquiryStatusNotFound');
          return;
        }
        feedback.textContent = '';
        currentProgress = data.progress;
        renderProgress(currentProgress);
      } catch {
        feedback.textContent = t('inquiryStatusError');
      }
    });
  });
})();
