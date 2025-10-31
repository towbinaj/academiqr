// Simple client-side router
export class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(pattern, handler) {
        this.routes.push({
            pattern: this.parsePattern(pattern),
            handler
        });
    }

    parsePattern(pattern) {
        const parts = pattern.split('/');
        const params = [];
        
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].startsWith(':')) {
                params.push({
                    index: i,
                    name: parts[i].slice(1)
                });
            }
        }

        return {
            pattern,
            parts,
            params
        };
    }

    match(path) {
        const pathParts = path.split('/').filter(part => part !== '');
        
        for (const route of this.routes) {
            if (route.parts.length !== pathParts.length) {
                continue;
            }

            const params = {};
            let matches = true;

            for (let i = 0; i < route.parts.length; i++) {
                const routePart = route.parts[i];
                const pathPart = pathParts[i];

                if (routePart.startsWith(':')) {
                    params[routePart.slice(1)] = pathPart;
                } else if (routePart !== pathPart) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return {
                    handler: route.handler,
                    params
                };
            }
        }

        return null;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    getCurrentPath() {
        return window.location.pathname;
    }
}


