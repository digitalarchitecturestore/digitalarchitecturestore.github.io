(function () {
    'use strict';

    const storageKey = 'da-store-attribution-v1';

    const parameters = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_id',
        'utm_content',
        'utm_term',
        'utm_source_platform',
        'utm_creative_format',
        'utm_marketing_tactic'
    ];

    const currentURL = new URL(window.location.href);
    let attribution = {};

    try {
        attribution = JSON.parse(
            sessionStorage.getItem(storageKey) || '{}'
        ) || {};
    } catch (error) {
        attribution = {};
    }

    const incoming = {};

    parameters.forEach(function (parameter) {
        const value = currentURL.searchParams.get(parameter);

        if (value) {
            incoming[parameter] = value;
        }
    });

    if (Object.keys(incoming).length > 0) {
        attribution = incoming;

        try {
            sessionStorage.setItem(
                storageKey,
                JSON.stringify(attribution)
            );
        } catch (error) {
            // Storage unavailable.
        }
    }

    function updateCheckoutLinks() {
        document.querySelectorAll('a[href]').forEach(function (link) {
            try {
                const url = new URL(link.href);

                if (
                    url.protocol !== 'https:' ||
                    url.hostname !== 'pay.hotmart.com'
                ) {
                    return;
                }

                parameters.forEach(function (parameter) {
                    url.searchParams.delete(parameter);

                    if (attribution[parameter]) {
                        url.searchParams.set(
                            parameter,
                            attribution[parameter]
                        );
                    }
                });

                link.href = url.href;

            } catch (error) {
                // Invalid URL.
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            updateCheckoutLinks
        );
    } else {
        updateCheckoutLinks();
    }

})();
