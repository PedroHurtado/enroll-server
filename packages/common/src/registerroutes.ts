const KONG_ADMIN_URL = process.env.KONG_ADMIN_URL || 'http://localhost:8001';
const BACKEND_URL = process.env.BACKEND_URL || 'http://host.docker.internal:3000';
const HOSTS = process.env.KONG_HOSTS?.split(',') || ['*.enroll.com'];

/**
 * @description: Function to make fetch requests with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit, errorMessage: string) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorMessage}: ${response.status} - ${errorData?.message || response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
}

/**
 * @description: Function to get a service by name
 */
async function getService(serviceName: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceName}`);
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Error getting service '${serviceName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error getting service '${serviceName}':`, error);
        return null;
    }
}

/**
 * @description: Function to register a service if it doesn't exist, or return it if it does
 */
async function registerService(serviceName: string, url: string) {
    const existingService = await getService(serviceName);

    if (existingService) {
        console.log(`Service '${serviceName}' already exists. ID: ${existingService.id}`);
        return existingService;
    }

    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: serviceName, url }),
        },
        `Error registering service '${serviceName}'`
    );
}

/**
 * @description: Function to get a route by name and service ID
 */
async function getRoute(serviceId: string, routeName: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/routes/${routeName}`);
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Error getting route '${routeName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error getting route '${routeName}':`, error);
        return null;
    }
}

/**
 * @description: Function to register or update a route
 */
async function registerOrUpdateRoute(serviceId: string, routeName: string, path: string, methods: string[] = []) {
    const existingRoute = await getRoute(serviceId, routeName);

    const routeConfig = {
        name: routeName,
        hosts: HOSTS,
        paths: [path],
        methods,
        strip_path: false, // Do not remove the base path
    };

    if (existingRoute) {
        console.log(`Route '${routeName}' already exists. ID: ${existingRoute.id}. Updating...`);
        return fetchWithErrorHandling(
            `${KONG_ADMIN_URL}/services/${serviceId}/routes/${existingRoute.id}`, // Use route ID for update
            {
                method: 'PATCH', // Use PATCH for updates
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeConfig),
            },
            `Error updating route '${routeName}'`
        );
    } else {
        return fetchWithErrorHandling(
            `${KONG_ADMIN_URL}/services/${serviceId}/routes`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeConfig),
            },
            `Error registering route '${routeName}'`
        );
    }
}

interface KongPlugin {
    id: string;
    name: string;
    // ... other plugin properties you might need
}

/**
 * @description: Function to get the ID of a plugin by name and service ID
 */
async function getPluginId(serviceId: string, pluginName: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/plugins`);
        if (response.ok) {
            const plugins: { data: KongPlugin[] } = await response.json();
            if (plugins && plugins.data) {
                const plugin = plugins.data.find((p: KongPlugin) => p.name === pluginName);
                if (plugin) {
                    return plugin.id;
                }
            }
            return null; // Plugin not found
        } else {
            throw new Error(`Error listing plugins: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error listing plugins:`, error);
        return null;
    }
}

async function getPlugin(serviceId: string, pluginName: string) {
    const pluginId = await getPluginId(serviceId, pluginName);
    if (!pluginId) {
        return null;
    }

    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/plugins/${pluginId}`);
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Error getting plugin '${pluginName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error getting plugin '${pluginName}':`, error);
        return null;
    }
}

/**
 * @description: Function to register or update a plugin in a service
 */
async function registerOrUpdatePluginToService(serviceId: string, pluginName: string, config: any) {
    const existingPlugin = await getPlugin(serviceId, pluginName);

    if (existingPlugin) {
        console.log(`Plugin '${pluginName}' already exists in the service. ID: ${existingPlugin.id}. Updating...`);
        return fetchWithErrorHandling(
            `${KONG_ADMIN_URL}/services/${serviceId}/plugins/${existingPlugin.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config: config }),
            },
            `Error updating plugin '${pluginName}' in the service`
        );
    }

    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services/${serviceId}/plugins`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pluginName, config: config }),
        },
        `Error registering plugin '${pluginName}' in the service`
    );
}

/**
 * @description: Main function to register entities in Kong
 */
export async function registerKongEntities(service: string, routes: { name: string; path: string; methods?: string[] }[]) {
    try {
        const serviceData = await registerService(service, BACKEND_URL);

        await Promise.all(
            routes.map(({ name, path, methods = [] }) =>
                registerOrUpdateRoute(serviceData.id, name, path, methods) // Use the new function that updates or creates
            )
        );

        const preFunctionConfig = {
            access: [
                "local host = kong.request.get_host(); local tenant = string.match(host, '^([^.]+)%.enroll%.com$'); if tenant then kong.service.request.add_header('X-Tenant', tenant) end",
            ],
        };

        await registerOrUpdatePluginToService(serviceData.id, 'pre-function', preFunctionConfig);

        console.log('Kong registration completed.');
    } catch (error) {
        console.error('Error during Kong registration:', error);
    }
}