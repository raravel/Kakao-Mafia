import Home from '../views/Home.svelte';
import Login from '../views/Login.svelte';

const routes = new Map();


routes.set('/', Home);
routes.set('/login', Login);

export default routes;
