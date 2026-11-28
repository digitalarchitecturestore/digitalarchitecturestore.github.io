(function () {
    'use strict';

    const storageKey = 'da-store-attribution-v1';
    const consentKey = 'da-store-analytics-consent-v1';

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

    function getConsent() {
        try {
            return localStorage.getItem(consentKey);
        } catch (error) {
            return null;
        }
    }

    function clearAttribution() {
        try {
            sessionStorage.removeItem(storageKey);
        } catch (error) {}
    }

    function getAttribution() {
        let attribution = {};

        try {
            attribution = JSON.parse(
                sessionStorage.getItem(storageKey) || '{}'
            ) || {};
        } catch (error) {}

        const currentURL = new URL(window.location.href);
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
            } catch (error) {}
        }

        return attribution;
    }

    function updateCheckoutLinks(attribution, accepted) {
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

                if (!accepted) {
                    url.searchParams.delete('_gl');
                }

                if (link.href !== url.href) {
                    link.href = url.href;
                }

            } catch (error) {}
        });
    }

    function applyConsent(consent) {
        if (consent === 'accepted') {
            updateCheckoutLinks(getAttribution(), true);
        } else {
            clearAttribution();
            updateCheckoutLinks({}, false);
        }
    }

    function init() {
        applyConsent(getConsent());
    }

    window.addEventListener('da:consent-change', function (event) {
        applyConsent(event.detail);
    });

    window.addEventListener('storage', function (event) {
        if (event.key === consentKey || event.key === null) {
            applyConsent(getConsent());
        }
    });

    window.addEventListener('pageshow', init);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
