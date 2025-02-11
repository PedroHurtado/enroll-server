import { config } from "./config";
const KONG_ADMIN_URL = config.kong;
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
 * @description: Function to register a service if it doesn't exist
 */
async function registerService(serviceName: string, url: string) {
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
 * @description: Function to delete all routes for a service
 */
async function deleteAllRoutes(serviceId: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/routes`);
        if (response.ok) {
            const routes = await response.json();
            await Promise.all(
                routes.data.map(async (route: any) => {
                    const deleteResponse = await fetch(`${KONG_ADMIN_URL}/routes/${route.id}`, {
                        method: 'DELETE'
                    });
                    if (!deleteResponse.ok) {
                        throw new Error(`Failed to delete route ${route.id}: ${deleteResponse.status}`);
                    }
                    console.log(`Route ${route.name} deleted successfully`);
                })
            );
        }
    } catch (error) {
        console.error('Error deleting routes:', error);
        throw error;
    }
}

/**
 * @description: Function to delete all plugins for a service
 */
async function deleteAllPlugins(serviceId: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/plugins`);
        if (response.ok) {
            const plugins = await response.json();
            await Promise.all(
                plugins.data.map(async (plugin: any) => {
                    const deleteResponse = await fetch(`${KONG_ADMIN_URL}/plugins/${plugin.id}`, {
                        method: 'DELETE'
                    });
                    if (!deleteResponse.ok) {
                        throw new Error(`Failed to delete plugin ${plugin.id}: ${deleteResponse.status}`);
                    }
                    console.log(`Plugin ${plugin.name} deleted successfully`);
                })
            );
        }
    } catch (error) {
        console.error('Error deleting plugins:', error);
        throw error;
    }
}

/**
 * @description: Function to register a route
 */
async function registerRoute(serviceId: string, routeName: string, path: string, methods: string[] = []) {
    const routeConfig = {
        name: routeName,
        hosts: HOSTS,
        paths: [path],
        methods,
        strip_path: false,
    };

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

/**
 * @description: Function to register a plugin
 */
async function registerPlugin(serviceId: string, pluginName: string, config: any) {
    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services/${serviceId}/plugins`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pluginName, config: config }),
        },
        `Error registering plugin '${pluginName}'`
    );
}

/**
 * @description: Main function to register Kong entities
 */
export async function registerKongEntities(service: string, routes: { name: string; path: string; methods?: string[] }[]) {
    try {
        // Check if service exists
        let serviceData = await getService(service);
        
        if (serviceData) {
            console.log(`Service '${service}' exists. Removing routes and plugins...`);
            await deleteAllRoutes(serviceData.id);
            await deleteAllPlugins(serviceData.id);
        } else {
            console.log(`Service '${service}' does not exist. Creating new service...`);
            serviceData = await registerService(service, BACKEND_URL);
        }

        // Create new routes
        console.log('Creating routes...');
        await Promise.all(
            routes.map(({ name, path, methods = [] }) =>
                registerRoute(serviceData.id, name, path, methods)
            )
        );

        // Create plugin
        console.log('Creating plugin...');
        const preFunctionConfig = {
            access: [
                "local host = kong.request.get_host(); local tenant = string.match(host, '^([^.]+)%.enroll%.com$'); if tenant then kong.service.request.add_header('X-Tenant', tenant) end",
            ],
        };

        await registerPlugin(serviceData.id, 'pre-function', preFunctionConfig);

        console.log('Kong registration completed successfully.');
    } catch (error) {
        console.error('Error during Kong registration:', error);
        throw error;
    }
}