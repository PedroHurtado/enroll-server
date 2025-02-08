const KONG_ADMIN_URL = process.env.KONG_ADMIN_URL || 'http://localhost:8001';
const BACKEND_URL = process.env.BACKEND_URL || 'http://host.docker.internal:3000';
const HOSTS = process.env.KONG_HOSTS?.split(',') || ['*.enroll.com'];

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

async function getService(serviceName: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceName}`);
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Error al obtener el servicio '${serviceName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error al obtener el servicio '${serviceName}':`, error);
        return null;
    }
}

async function registerService(serviceName: string, url: string) {
    const existingService = await getService(serviceName);

    if (existingService) {
        console.log(`El servicio '${serviceName}' ya existe. ID: ${existingService.id}`);
        return existingService;
    }

    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: serviceName, url }),
        },
        `Error al registrar el servicio '${serviceName}'`
    );
}

async function getRoute(serviceId: string, routeName: string) {
    try {
        const response = await fetch(`${KONG_ADMIN_URL}/services/${serviceId}/routes/${routeName}`);
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Error al obtener la ruta '${routeName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error al obtener la ruta '${routeName}':`, error);
        return null;
    }
}

async function registerRoute(serviceId: string, routeName: string, path: string, methods: string[] = []) {
    const existingRoute = await getRoute(serviceId, routeName);

    if (existingRoute) {
        console.log(`La ruta '${routeName}' ya existe. ID: ${existingRoute.id}`);
        return existingRoute;
    }

    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services/${serviceId}/routes`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: routeName, hosts: HOSTS, paths: [path], methods, strip_path: false }),
        },
        `Error al registrar la ruta '${routeName}'`
    );
}

interface KongPlugin {
    id: string;
    name: string;
    // ... otras propiedades del plugin que puedas necesitar
}

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
            return null; // Plugin no encontrado
        } else {
            throw new Error(`Error al listar plugins: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error al listar plugins:`, error);
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
            throw new Error(`Error al obtener el plugin '${pluginName}': ${response.status}`);
        }
    } catch (error) {
        console.error(`Error al obtener el plugin '${pluginName}':`, error);
        return null;
    }
}

async function registerOrUpdatePluginToService(serviceId: string, pluginName: string, config: any) {
    const existingPlugin = await getPlugin(serviceId, pluginName);

    if (existingPlugin) {
        console.log(`El plugin '${pluginName}' ya existe en el servicio. ID: ${existingPlugin.id}. Actualizando...`);
        return fetchWithErrorHandling(
            `${KONG_ADMIN_URL}/services/${serviceId}/plugins/${existingPlugin.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config: config }),
            },
            `Error al actualizar el plugin '${pluginName}' en el servicio`
        );
    }

    return fetchWithErrorHandling(
        `${KONG_ADMIN_URL}/services/${serviceId}/plugins`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pluginName, config: config }),
        },
        `Error al registrar el plugin '${pluginName}' en el servicio`
    );
}

export async function registerKongEntities(service: string, routes: { name: string; path: string; methods?: string[] }[]) {
    try {
        const serviceData = await registerService(service, BACKEND_URL);

        await Promise.all(
            routes.map(({ name, path, methods = [] }) =>
                registerRoute(serviceData.id, name, path, methods)
            )
        );

        const preFunctionConfig = {
            access: [
                "local host = kong.request.get_host(); local tenant = string.match(host, '^([^.]+)%.enroll%.com$'); if tenant then kong.service.request.add_header('X-Tenant', tenant) end",
            ],
        };

        await registerOrUpdatePluginToService(serviceData.id, 'pre-function', preFunctionConfig);

        console.log('Registro en Kong completado.');
    } catch (error) {
        console.error('Error durante el registro en Kong:', error);
    }
}