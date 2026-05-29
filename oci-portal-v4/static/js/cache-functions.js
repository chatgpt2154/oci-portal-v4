/* ─────────────────────────────────────────────────────────────────────────
   Cache Management Functions - JDE Clear Cache functionality
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Clear cache for a specific JDE environment
 * @param {string} cacheName - Cache environment name (DV920, PY920, DM920)
 */
async function clearCache(cacheName) {
  const btn = document.getElementById(`cache-btn-${cacheName}`);
  const resultDiv = document.getElementById(`cache-result-${cacheName}`);
  
  if (!btn || !resultDiv) return;

  // Disable button and show loading state
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Processing...';
  resultDiv.innerHTML = '';

  try {
    const response = await fetch(`/api/clearCaches/${cacheName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to clear ${cacheName} cache`);
    }

    // Display success message
    let html = `<div style="color:var(--green);font-size:11px;font-weight:600;padding:6px;background:rgba(34,197,94,0.1);border-radius:4px;border:1px solid rgba(34,197,94,0.3)">
      <i class="ti ti-check"></i> ${data.message}
    </div>`;
    
    if (data.results && data.results.length > 0) {
      html += '<div style="margin-top:8px;font-size:10px;color:var(--text-3)">';
      data.results.forEach(result => {
        const statusColor = result.status >= 200 && result.status < 300 ? 'var(--green)' : 'var(--red)';
        html += `<div style="margin:4px 0"><i class="ti ti-point-filled" style="color:${statusColor};margin-right:4px"></i>${result.path} (${result.status})</div>`;
      });
      html += '</div>';
    }

    resultDiv.innerHTML = html;
    showToast(`✓ Cache ${cacheName} cleared successfully`, 'success');

  } catch (error) {
    resultDiv.innerHTML = `<div style="color:var(--red);font-size:11px;font-weight:600;padding:6px;background:rgba(220,38,38,0.1);border-radius:4px;border:1px solid rgba(220,38,38,0.3)">
      <i class="ti ti-alert-circle"></i> ${error.message}
    </div>`;
    showToast(`✗ Error: ${error.message}`, 'error');

  } finally {
    // Re-enable button
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

/**
 * Open cache configuration modal (admin only)
 */
function openCacheConfig() {
  const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  if (user.role !== 'admin') {
    showToast('Only admins can configure cache settings', 'warning');
    return;
  }
  // TODO: Implement cache configuration modal
  showToast('Cache configuration coming soon', 'info');
}

/**
 * Switch to cache tab and initialize if needed
 */
function switchToCache() {
  switchTab('cache');
  // Initialize cache buttons if not already done
  const cacheButtons = document.querySelectorAll('.btn-cache');
  if (cacheButtons.length > 0 && !cacheButtons[0].dataset.initialized) {
    cacheButtons.forEach(btn => btn.dataset.initialized = 'true');
  }
}

