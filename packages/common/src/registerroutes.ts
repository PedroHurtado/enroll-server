import { config } from "./config";

class KongService {
    private backendUrl: string = "";
    private hosts: string[] = [];

    constructor(private serviceName: string, hosts: string[], backendUrl: string) {
        this.hosts = hosts;
        this.backendUrl = backendUrl;
    }

    /**
     * @description Helper function to handle fetch requests
     */
    private async fetchWithErrorHandling(url: string, options: RequestInit, errorMessage: string) {
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
     * @description Get service details from Kong
     */
    private async getService() {
        try {
            const response = await fetch(`${config.kong}/services/${this.serviceName}`);
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error(`Error fetching service '${this.serviceName}':`, error);
            return null;
        }
    }

    /**
     * @description Register a new service
     */
    private async registerService() {
        return this.fetchWithErrorHandling(
            `${config.kong}/services`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: this.serviceName, url: this.backendUrl }),
            },
            `Error registering service '${this.serviceName}'`
        );
    }

    /**
     * @description Delete all routes for a given service
     */
    private async deleteAllRoutes(serviceId: string) {
        try {
            const response = await fetch(`${config.kong}/services/${serviceId}/routes`);
            if (!response.ok) return;

            const routes = await response.json();
            await Promise.allSettled(
                routes.data.map((route: any) =>
                    fetch(`${config.kong}/routes/${route.id}`, { method: "DELETE" })
                )
            );

            console.log(`All routes for service '${this.serviceName}' deleted.`);
        } catch (error) {
            console.error(`Error deleting routes for '${this.serviceName}':`, error);
        }
    }

    /**
     * @description Delete all plugins for a given service
     */
    private async deleteAllPlugins(serviceId: string) {
        try {
            const response = await fetch(`${config.kong}/services/${serviceId}/plugins`);
            if (!response.ok) return;

            const plugins = await response.json();
            await Promise.allSettled(
                plugins.data.map((plugin: any) =>
                    fetch(`${config.kong}/plugins/${plugin.id}`, { method: "DELETE" })
                )
            );

            console.log(`All plugins for service '${this.serviceName}' deleted.`);
        } catch (error) {
            console.error(`Error deleting plugins for '${this.serviceName}':`, error);
        }
    }

    /**
     * @description Delete the service
     */
    private async deleteService(serviceId: string) {
        try {
            const response = await fetch(`${config.kong}/services/${serviceId}`, { method: "DELETE" });
            if (response.ok) {
                console.log(`Service '${this.serviceName}' deleted successfully.`);
            }
        } catch (error) {
            console.error(`Error deleting service '${this.serviceName}':`, error);
        }
    }

    /**
     * @description Register a route
     */
    private async registerRoute(serviceId: string, routeName: string, path: string, methods: string[] = []) {
        return this.fetchWithErrorHandling(
            `${config.kong}/services/${serviceId}/routes`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: routeName,
                    hosts: this.hosts,
                    paths: [path],
                    methods,
                    strip_path: false,
                }),
            },
            `Error registering route '${routeName}'`
        );
    }

    /**
     * @description Register a plugin
     */
    private async registerPlugin(serviceId: string, pluginName: string, pluginConfig: any) {
        return this.fetchWithErrorHandling(
            `${config.kong}/services/${serviceId}/plugins`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: pluginName, config: pluginConfig }),
            },
            `Error registering plugin '${pluginName}'`
        );
    }

    /**
     * @description Main function to register Kong entities
     */
    async setup(routes: { name: string; path: string; methods?: string[] }[]) {
        try {
            let serviceData = await this.getService();

            if (serviceData) {
                console.log(`Service '${this.serviceName}' exists. Removing routes and plugins...`);
                await this.deleteAllRoutes(serviceData.id);
                await this.deleteAllPlugins(serviceData.id);
                await this.deleteService(serviceData.id); // 🔹 **Elimina el servicio después de rutas y plugins**
                serviceData = null;
            }

            if (!serviceData) {
                console.log(`Service '${this.serviceName}' does not exist. Creating new service...`);
                serviceData = await this.registerService();
            }

            // Create new routes
            console.log("Creating routes...");
            await Promise.all(
                routes.map(({ name, path, methods = [] }) =>
                    this.registerRoute(serviceData.id, name, path, methods)
                )
            );

            // Create plugin
            console.log("Creating plugin...");
            const preFunctionConfig = {
                access: [
                    "local host = kong.request.get_host(); local tenant = string.match(host, '^([^.]+)%.enroll%.com$'); if tenant then kong.service.request.add_header('X-Tenant', tenant) end",
                ],
            };

            await this.registerPlugin(serviceData.id, "pre-function", preFunctionConfig);

            console.log("Kong registration completed successfully.");
        } catch (error) {
            console.error("Error during Kong registration:", error);
            throw error;
        }
    }
}

/**
 * @description: Expose a function to register Kong entities
 */
export async function registerKongEntities(
    service: string,
    hosts: string[],
    backendUrl: string,
    routes: { name: string; path: string; methods?: string[] }[]
) {
    const kongService = new KongService(service, hosts, backendUrl);
    return kongService.setup(routes);
}
