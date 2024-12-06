import { addResource, bookmarkResource, getResource } from "../Controlller/resource.controller.js";

export function resourceRoutes(app) {
    app.get("/resource", getResource);
    app.post("/resource", addResource);
    app.post("/bookmark/:id", bookmarkResource);
};