(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    '[data-pjax]',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    '#back-to-top',
                    '#comments link',
                    '#comments script'
                ],
                cacheBust: false
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    // // Listen for start of Pjax
    // document.addEventListener('pjax:send', function() {
    //     return;
    //     // TODO pace start loading animation
    // })

    // Listen for completion of Pjax
    document.addEventListener('pjax:complete', function() {
        // Re-initialize scripts after pjax navigation
        if (typeof window.IcarusThemeSettings !== 'undefined') {
            // Re-run main.js initialization
            if (typeof jQuery !== 'undefined' && typeof window.moment !== 'undefined') {
                // Trigger a custom event to reinitialize
                const event = new CustomEvent('icarus:reinit');
                document.dispatchEvent(event);
            }
        }
        
        // Re-apply contains patch after pjax navigation to ensure it's still active
        setTimeout(function() {
            if (typeof EventTarget !== 'undefined' && EventTarget.prototype.contains) {
                const originalContains = EventTarget.prototype.contains;
                if (originalContains.toString().indexOf('nodeType') === -1) {
                    // Patch not applied, re-apply it
                    EventTarget.prototype.contains = function(node) {
                        if (!node) return false;
                        if (node.nodeType !== 1) {
                            node = node.parentElement || (node.parentNode && node.parentNode.nodeType === 1 ? node.parentNode : null);
                        }
                        if (!node || node.nodeType !== 1) return false;
                        try {
                            return originalContains.call(this, node);
                        } catch (e) {
                            return false;
                        }
                    };
                }
            }
        }, 50);
    });

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
